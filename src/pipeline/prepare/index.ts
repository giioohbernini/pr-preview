import * as core from '@actions/core'
import * as github from '@actions/github'
import { IReturnPrepare } from './types'
import generateLogUrl from '../../helpers/generateLogUrl'
import getGitCommitSha from '../../helpers/getGitCommitSha'
import getPullRequestNumber from '../../helpers/getPullRequestNumber'

const checkingPullRequestNumber = async () => {
	const prNumber = await getPullRequestNumber()

	if (!prNumber) {
		core.info(`😢 No related PR found, skip it.`)
		return
	}

	return prNumber
}

const mountedUrlTenants = async (domainTenant: string) => {
	const { job } = github.context
	const previewUrl = core.getInput('preview_url') || ''
	const repoOwner = github.context.repo.owner.replace(/\./g, '-')
	const repoName = github.context.repo.repo.replace(/\./g, '-')
	const prNumber = await checkingPullRequestNumber()

	core.info(`Find PR number: ${prNumber}`)

	return previewUrl
		.replace('{{repoOwner}}', repoOwner)
		.replace('{{repoName}}', repoName)
		.replace('{{job}}', job)
		.replace('{{prNumber}}', `${prNumber}`)
		.concat(domainTenant)
}

const prepare = async (): Promise<IReturnPrepare> => {
	const tokenList = {
		surge: core.getInput('surge_token'),
		vercel: core.getInput('vercel_token'),
	}
	const previewPath = core.getInput('preview_path')
	const distFolder = core.getInput('dist')
	const teardown =
		core.getInput('teardown')?.toString().toLowerCase() === 'true'
	const { payload } = github.context
	const gitCommitSha = getGitCommitSha()

	const mountedUrlSurge = await mountedUrlTenants('.surge.sh')
	const mountedUrlVercel = await mountedUrlTenants('.vercel.app')

	const buildingLogUrl = await generateLogUrl()

	const shouldShutdown = teardown && payload.action === 'closed'

	core.debug('github.context')
	core.debug(JSON.stringify(github.context, null, 2))
	core.debug(JSON.stringify(github.context.repo, null, 2))
	core.debug(`payload.after: ${payload.after}`)
	core.debug(`payload.after: ${payload.pull_request}`)
	core.debug(`event action?: ${payload.action}`)
	core.debug(`teardown enabled?: ${teardown}`)

	core.info('Finalizing the initialization of the variables.')

	return {
		tokenList,
		previewPath,
		distFolder,
		gitCommitSha,
		buildingLogUrl,
		shouldShutdown,
		mountedUrlSurge,
		mountedUrlVercel,
	}
}

export default prepare
