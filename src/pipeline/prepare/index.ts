import * as core from '@actions/core'
import * as github from '@actions/github'
import generateLogUrl from '../../helpers/generateLogUrl'
import getGitCommitSha from '../../helpers/getGitCommitSha'
import getPullRequestNumber from '../../helpers/getPullRequestNumber'

interface IReturnPrepare {
	tokenList: { surge: string; vercel: string }
	previewPath: string
	distFolder: string
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
	shouldShutdown: boolean
}

const checkingPullRequestNumber = async () => {
	const prNumber = await getPullRequestNumber()

	if (!prNumber) {
		core.info(`😢 No related PR found, skip it.`)
		return
	}

	return prNumber
}

const prepare = async (): Promise<IReturnPrepare> => {
	const tokenList = {
		surge: core.getInput('surge_token'),
		vercel: core.getInput('vercel_token'),
	}
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

	const shouldShutdown = teardown && payload.action === 'closed'

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
		tokenList,
		previewPath,
		distFolder,
		gitCommitSha,
		mountedUrl,
		outputUrl,
		buildingLogUrl,
		shouldShutdown,
	}
}

export default prepare
