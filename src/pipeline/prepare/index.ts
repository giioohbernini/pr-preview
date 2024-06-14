import * as core from '@actions/core'
import * as github from '@actions/github'
import { IReturnPrepare } from './types'
import generateLogUrl from '../../helpers/generateLogUrl'
import getGitCommitSha from '../../helpers/getGitCommitSha'
import getPullRequestNumber from '../../helpers/getPullRequestNumber'
import tenantsFactory from '../../tenants/utils/tenantsFactory'

const checkingPullRequestNumber = async () => {
	const prNumber = await getPullRequestNumber()

	if (!prNumber) {
		core.info(`😢 No related PR found, skip it.`)
		return
	}

	return prNumber
}

const prepare = async (): Promise<IReturnPrepare> => {
	const { job } = github.context
	const previewPath = core.getInput('preview_path')
	const distFolder = core.getInput('dist')
	const buildCommand = core.getInput('build')
	const teardown =
		core.getInput('teardown')?.toString().toLowerCase() === 'true'
	const { payload } = github.context
	const gitCommitSha = getGitCommitSha()

	const tenantsConfig = {
		job,
		previewUrl: core.getInput('preview_url'),
		previewPath: core.getInput('preview_path'),
		repoOwner: github.context.repo.owner.replace(/\./g, '-'),
		repoName: github.context.repo.repo.replace(/\./g, '-'),
		prNumber: await checkingPullRequestNumber(),
	}

	const tenantsList = [
		{
			...(await tenantsFactory({
				tenantName: 'surge',
				domainTenant: '.surge.sh',
				token: core.getInput('surge_token'),
				...tenantsConfig,
			})),
		},
		{
			...(await tenantsFactory({
				tenantName: 'vercel',
				domainTenant: '.vercel.app',
				token: core.getInput('vercel_token'),
				...tenantsConfig,
			})),
		},
	]

	const buildingLogUrl = await generateLogUrl()

	const shouldShutdown = teardown && payload.action === 'closed'

	core.debug('github.context')
	core.debug(JSON.stringify(github.context, null, 2))
	core.debug(JSON.stringify(github.context.repo, null, 2))
	core.debug(`payload.after: ${payload.after}`)
	core.debug(`payload.after: ${payload.pull_request}`)
	core.debug(`event action?: ${payload.action}`)
	core.debug(`teardown enabled?: ${teardown}`)
	core.debug(`tenantsList: ${JSON.stringify(tenantsList)}`)
	core.info('Finalizing the initialization of the variables.')
	core.debug(`Tenant list: ${JSON.stringify(tenantsList)}`)
	return {
		previewPath,
		distFolder,
		buildCommand,
		gitCommitSha,
		buildingLogUrl,
		shouldShutdown,
		tenantsList,
	}
}

export default prepare
