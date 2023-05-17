import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec } from '@actions/exec'
import { comment as githubComment } from './commentToPullRequest'
import { execSurgeCommand, formatImage } from './helpers'
import {
	vercelDeploy,
	vercelRemoveProjectDeploy,
	removeSchema,
} from '../tenants/vercel'
import prepare from '../previewPipeline/prepare'
import build from '../previewPipeline/build'

function getGitCommitSha(): string {
	const { payload } = github.context
	const gitCommitSha =
		payload.after ||
		payload?.pull_request?.head?.sha ||
		payload?.workflow_run?.head_sha

	return gitCommitSha
}

async function getPullRequestNumber(): Promise<number | undefined> {
	const token = core.getInput('github_token', { required: true })
	const octokit = github.getOctokit(token)
	const { payload } = github.context
	const gitCommitSha = getGitCommitSha()
	const prNumberExists = payload.number && payload.pull_request

	if (prNumberExists) {
		return Number(payload.number)
	}

	if (!prNumberExists) {
		const result =
			await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				commit_sha: gitCommitSha,
			})
		const pr = result.data.length > 0 && result.data[0]
		core.debug('listPullRequestsAssociatedWithCommit')
		core.debug(JSON.stringify(pr, null, 2))
		const prNumber = pr ? Number(pr.number) : undefined
		return prNumber
	}
}

async function comment(message: string): Promise<void> {
	const { job, payload } = github.context
	const prOwner = payload.pull_request?.owner
	const fromForkedRepo = prOwner === github.context.repo.owner
	const token = core.getInput('github_token', { required: true })
	const octokit = github.getOctokit(token)
	const prNumber = await getPullRequestNumber()

	if (fromForkedRepo) {
		return
	}

	githubComment({
		repo: github.context.repo,
		number: Number(prNumber),
		message,
		octokit,
		header: job,
	})
}

async function generateLogUrl(): Promise<string> {
	const token = core.getInput('github_token', { required: true })
	const octokit = github.getOctokit(token)
	const { job } = github.context

	const gitCommitSha = getGitCommitSha()

	let data
	try {
		const result = await octokit.rest.checks.listForRef({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			ref: gitCommitSha,
		})
		data = result.data
	} catch (err) {
		core.info('generateLogUrl error')
		await fail(err)
		return ''
	}

	core.debug(JSON.stringify(data?.check_runs, null, 2))

	let checkRunId
	if (data?.check_runs?.length >= 0) {
		const checkRun = data?.check_runs?.find((item) => item.name === job)
		checkRunId = checkRun?.id
	}

	const buildingLogUrl = checkRunId
		? `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/runs/${checkRunId}`
		: `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`

	return buildingLogUrl
}

async function fail(err: Error) {
	core.info('error message:')
	core.info(JSON.stringify(err, null, 2))
	const repoOwner = github.context.repo.owner
	const repoName = github.context.repo.repo
	const repoId = github.context.runId
	const buildLogsUrl = `https://github.com/${repoOwner}/${repoName}/actions/runs/${repoId}`
	const buildingLogUrl = await generateLogUrl()

	const gitCommitSha = getGitCommitSha()

	const image = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90250824-4e066700-de6f-11ea-8230-600ecc3d6a6b.png',
	})

	await comment(
		`😭 Deploy PR Preview ${gitCommitSha} failed. [Build logs](${buildLogsUrl}) \n ${image}`
	)

	const failOnError = !!(
		core.getInput('failOnError') || process.env.FAIL_ON__ERROR
	)

	if (failOnError) {
		core.setFailed(err.message)
	}
}

async function main() {
	const {
		surgeToken,
		previewUrl,
		previewPath,
		distFolder,
		teardown,
		prNumber,
		jobContext,
		payloadContext,
		gitCommitSha,
		vercelConfig,
	} = await prepare({ getPullRequestNumber, getGitCommitSha })
	let { vercelToken, deploymentUrlVercel } = vercelConfig

	if (!prNumber) {
		core.info(`😢 No related PR found, skip it.`)
		return
	}

	const { mountedPreviewRrl, outputUrl, buildingLogUrl } = await build({
		previewUrl,
		jobContext,
		prNumber,
		previewPath,
		generateLogUrl,
		teardown,
		payloadContext,
	})

	if (teardown && payloadContext.action === 'closed') {
		try {
			core.info(`Teardown: ${mountedPreviewRrl}`)
			core.setSecret(surgeToken)
			await execSurgeCommand({
				command: [
					'surge',
					'teardown',
					mountedPreviewRrl,
					`--token`,
					surgeToken,
				],
			})

			const image = formatImage({
				buildingLogUrl,
				imageUrl:
					'https://user-images.githubusercontent.com/507615/98094112-d838f700-1ec3-11eb-8530-381c2276b80e.png',
			})

			if (vercelToken) await vercelRemoveProjectDeploy(deploymentUrlVercel)

			return await comment(
				`:recycle: [PR Preview](https://${outputUrl}) ${gitCommitSha} has been successfully destroyed since this PR has been closed. \n ${image}`
			)
		} catch (err) {
			core.info('teardown error')
			return await fail(err)
		}
	}

	const deployingImage = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90240294-8d2abd00-de5b-11ea-8140-4840a0b2d571.gif',
	})

	await comment(
		`⚡️ Deploying PR Preview ${gitCommitSha} to [surge.sh](https://${outputUrl}) ... [Build logs](${buildingLogUrl}) \n ${deployingImage}`
	)

	const startTime = Date.now()
	try {
		if (!core.getInput('build')) {
			await exec(`npm install`)
			await exec(`npm run build`)
		} else {
			const buildCommands = core.getInput('build').split('\n')
			for (const command of buildCommands) {
				core.info(`RUN: ${command}`)
				await exec(command)
			}
		}
		const duration = (Date.now() - startTime) / 1000
		core.info(`Build time: ${duration} seconds`)
		core.info(`Deploy to ${mountedPreviewRrl}`)
		core.setSecret(surgeToken)
		const image = formatImage({
			buildingLogUrl,
			imageUrl:
				'https://user-images.githubusercontent.com/507615/90250366-88233900-de6e-11ea-95a5-84f0762ffd39.png',
		})

		// Vercel
		if (vercelToken) {
			deploymentUrlVercel = await vercelDeploy(previewPath)
		}
		// Vercel

		await execSurgeCommand({
			command: [
				'surge',
				`./${distFolder}`,
				mountedPreviewRrl,
				`--token`,
				surgeToken,
			],
		})

		await comment(`
			🎊 PR Preview ${gitCommitSha} has been successfully built and deployed
		
			<table>
				<tr>
					<td><strong>✅ Preview: Surge</strong></td>
					<td><a href='https://${outputUrl}'>${outputUrl}</a></td>
				</tr>
				${
					vercelToken
						? `
							<tr>
								<td><strong>✅ Preview: Vercel</strong></td>
								<td><a href='${deploymentUrlVercel}'>${removeSchema(
								deploymentUrlVercel
						  )}</a></td>
							</tr>
						`
						: ''
				}
			</table>
			
			:clock1: Build time: **${duration}s** \n ${image}
		`)
	} catch (err) {
		core.info(`run command error ${err}`)
		await fail(err)
	}
}

// eslint-disable-next-line github/no-then
main().catch(async (err: Error) => {
	core.info('main error')
	await fail(err)
})
