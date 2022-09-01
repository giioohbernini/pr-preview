import * as core from '@actions/core'
import * as github from '@actions/github'
import exec from '@actions/exec'
import { stripIndents } from 'common-tags'

type MyOutPut = string
type MyError = string
type Options = Object

export function vercelInit() {
	const { context } = github
	const githubToken = core.getInput('github_token')
	const githubComment = core.getInput('github_comment') === 'true'
	const workingDirectory = core.getInput('working-directory')
	// vercel
	const vercelCli = core.getInput('vercel_cli')
	const vercelToken = core.getInput('vercel_token', { required: true })
	const vercelArgs = core.getInput('vercel_args')
	const vercelOrgId = core.getInput('vercel_org_id')
	const vercelProjectId = core.getInput('vercel_project_id')
	const vercelScope = core.getInput('scope')

	const octokit = github.getOctokit(githubToken)

	async function setEnv() {
		core.info('set environment for vercel cli')
		if (vercelOrgId) {
			core.info('set env variable : VERCEL_ORG_ID')
			core.exportVariable('VERCEL_ORG_ID', vercelOrgId)
		}
		if (vercelProjectId) {
			core.info('set env variable : VERCEL_PROJECT_ID')
			core.exportVariable('VERCEL_PROJECT_ID', vercelProjectId)
		}
	}

	async function vercelDeploy(ref: string, commit: string) {
		let myOutput: MyOutPut = ''
		let options: Options = {
			listeners: {
				stdout: (data: string): void => {
					myOutput += data.toString()
					core.info(data.toString())
				},
				stderr: (data: string): void => {
					core.info(data.toString())
				},
			},
		}

		if (workingDirectory) {
			options = {
				...options,
				cwp: workingDirectory,
			}
		}

		await exec.exec(
			'npx',
			[
				vercelCli,
				...vercelArgs.split(/ +/),
				'-t',
				vercelToken,
				'-m',
				`githubCommitSha=${context.sha}`,
				'-m',
				`githubCommitAuthorName=${context.actor}`,
				'-m',
				`githubCommitAuthorLogin=${context.actor}`,
				'-m',
				'githubDeployment=1',
				'-m',
				`githubOrg=${context.repo.owner}`,
				'-m',
				`githubRepo=${context.repo.repo}`,
				'-m',
				`githubCommitOrg=${context.repo.owner}`,
				'-m',
				`githubCommitRepo=${context.repo.repo}`,
				'-m',
				`githubCommitMessage="${commit}"`,
				'-m',
				`githubCommitRef=${ref}`,
			],
			options
		)

		return myOutput
	}

	async function vercelInspect(deploymentUrl: string) {
		let myError: MyError = ''
		let options: Options = {
			listeners: {
				stdout: (data: string) => {
					core.info(data.toString())
				},
				stderr: (data: string) => {
					myError += data.toString()
					core.info(data.toString())
				},
			},
		}

		if (workingDirectory) {
			options = {
				...options,
				cwp: workingDirectory,
			}
		}

		const args = ['vercel', 'inspect', deploymentUrl, '-t', vercelToken]

		if (vercelScope) {
			core.info('using scope')
			args.push('--scope', vercelScope)
		}
		await exec.exec('npx', args, options)

		const match = myError.match(/^\s+name\s+(.+)$/m)
		return match && match.length ? match[1] : null
	}

	async function findPreviousComment(text: string) {
		if (!octokit) {
			return null
		}

		core.info('find comment')

		const { data: comments } = await octokit.rest.repos.listCommentsForCommit({
			...context.repo,
			commit_sha: context.sha,
		})

		const vercelPreviewURLComment = comments.find((comment) =>
			comment.body.startsWith(text)
		)
		if (vercelPreviewURLComment) {
			core.info('previous comment found')
			return vercelPreviewURLComment.id
		}
		core.info('previous comment not found')
		return null
	}

	async function createCommentOnCommit(
		deploymentCommit: string,
		deploymentUrl: string,
		deploymentName: string
	) {
		if (!octokit) {
			return
		}
		const commentId = await findPreviousComment(
			`Deploy preview for _${deploymentName}_ ready!`
		)

		const commentBody = stripIndents`
			Deploy preview for _${deploymentName}_ ready!
			Built with commit ${deploymentCommit}
			${deploymentUrl}
		`

		if (commentId) {
			await octokit.rest.repos.updateCommitComment({
				...context.repo,
				comment_id: commentId,
				body: commentBody,
			})
		} else {
			await octokit.rest.repos.createCommitComment({
				...context.repo,
				commit_sha: context.sha,
				body: commentBody,
			})
		}
	}

	async function createCommentOnPullRequest(
		deploymentCommit: string,
		deploymentUrl: string,
		deploymentName: string
	) {
		if (!octokit) {
			return
		}
		const commentId = await findPreviousComment(
			`Deploy preview for _${deploymentName}_ ready!`
		)

		const commentBody = stripIndents`
			Deploy preview for _${deploymentName}_ ready!
			Built with commit ${deploymentCommit}
			✅ Preview: ${deploymentUrl}
			This pull request is being automatically deployed with [vercel-action](https://github.com/marketplace/actions/vercel-action)
		`

		if (commentId) {
			await octokit.rest.issues.updateComment({
				...context.repo,
				comment_id: commentId,
				body: commentBody,
			})
		} else {
			await octokit.rest.issues.createComment({
				...context.repo,
				issue_number: context.issue.number,
				body: commentBody,
			})
		}
	}

	return {
		githubComment,
		setEnv,
		vercelDeploy,
		vercelInspect,
		createCommentOnCommit,
		createCommentOnPullRequest,
	}
}
