import * as core from '@actions/core'
import * as github from '@actions/github'

interface ParansPrepare {
	getPullRequestNumber: () => Promise<number | undefined>
	getGitCommitSha: () => string
}

const prepare = async ({
	getPullRequestNumber,
	getGitCommitSha,
}: ParansPrepare) => {
	const surgeToken = core.getInput('surge_token')
	const previewUrl = core.getInput('preview_url')
	const previewPath = core.getInput('preview_path')
	const distFolder = core.getInput('dist')
	const teardown =
		core.getInput('teardown')?.toString().toLowerCase() === 'true'
	const prNumber = await getPullRequestNumber()
	core.debug('github.context')
	core.debug(JSON.stringify(github.context, null, 2))

	const { job, payload } = github.context
	core.debug(`payload.after: ${payload.after}`)
	core.debug(`payload.after: ${payload.pull_request}`)

	const gitCommitSha = getGitCommitSha()
	core.debug(JSON.stringify(github.context.repo, null, 2))

	const vercelConfig = {
		vercelToken: core.getInput('vercel_token'),
		deploymentUrlVercel: '',
	}

	core.info('Finalizing the initialization of the variables.')

	return {
		surgeToken,
		previewUrl,
		previewPath,
		distFolder,
		teardown,
		prNumber,
		jobContext: job,
		payloadContext: payload,
		gitCommitSha,
		vercelConfig,
	}
}

export default prepare
