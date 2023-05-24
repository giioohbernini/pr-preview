import * as core from '@actions/core'
import * as github from '@actions/github'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import generateLogUrl from '../../helpers/generateLogUrl'
import { getPullRequestNumber, getGitCommitSha } from '../../actions'

interface ReturnPrepare {
	surgeToken: string
	previewPath: string
	distFolder: string
	teardown: boolean
	payloadContext: WebhookPayload
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
	configVercel: { vercelToken: string; deploymentUrlVercel: string }
}

const checkingPullRequestNumber = async () => {
	const prNumber = await getPullRequestNumber()

	if (!prNumber) {
		core.info(`😢 No related PR found, skip it.`)
		return
	}

	return prNumber
}

const prepare = async (): Promise<ReturnPrepare> => {
	const surgeToken = core.getInput('surge_token')
	const previewUrl = core.getInput('preview_url')
	const previewPath = core.getInput('preview_path')
	const distFolder = core.getInput('dist')
	const teardown =
		core.getInput('teardown')?.toString().toLowerCase() === 'true'
	const prNumber = await checkingPullRequestNumber()
	const { job, payload } = github.context
	const gitCommitSha = getGitCommitSha()
	const repoOwner = github.context.repo.owner.replace(/\./g, '-')
	const repoName = github.context.repo.repo.replace(/\./g, '-')
	const mountedUrl = previewUrl
		.replace('{{repoOwner}}', repoOwner)
		.replace('{{repoName}}', repoName)
		.replace('{{job}}', job)
		.replace('{{prNumber}}', `${prNumber}`)
		.concat('.surge.sh')

	const outputUrl = mountedUrl.concat(previewPath)
	const buildingLogUrl = await generateLogUrl()
	const configVercel = {
		vercelToken: core.getInput('vercel_token'),
		deploymentUrlVercel: '',
	}

	core.setOutput('preview_url', outputUrl)

	core.debug('github.context')
	core.debug(JSON.stringify(github.context, null, 2))
	core.debug(JSON.stringify(github.context.repo, null, 2))
	core.debug(`payload.after: ${payload.after}`)
	core.debug(`payload.after: ${payload.pull_request}`)
	core.debug(`event action?: ${payload.action}`)
	core.debug(`teardown enabled?: ${teardown}`)

	core.info('Finalizing the initialization of the variables.')
	core.info(`Find PR number: ${prNumber}`)

	return {
		surgeToken,
		previewPath,
		distFolder,
		teardown,
		payloadContext: payload,
		gitCommitSha,
		mountedUrl,
		outputUrl,
		buildingLogUrl,
		configVercel,
	}
}

export default prepare
