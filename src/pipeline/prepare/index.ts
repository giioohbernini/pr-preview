import * as core from '@actions/core'
import * as github from '@actions/github'
import { IReturnPrepare } from './types'
import generateLogUrl from '../../helpers/generateLogUrl'
import getGitCommitSha from '../../helpers/getGitCommitSha'
import getPullRequestNumber from '../../helpers/getPullRequestNumber'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'

const checkingPullRequestNumber = async () => {
	const prNumber = await getPullRequestNumber()

	if (!prNumber) {
		core.info(`😢 No related PR found, skip it.`)
		return
	}

	return prNumber
}

const captalize = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1)
}

interface IDeployParams {
	token: string
	distFolder: string
	mountedUrl: string
}

const tenantsFactory = async ({
	tenantName,
	domainTenant,
	deploy,
	shutDown,
}: {
	tenantName: string
	domainTenant: string
	deploy: ({ token, distFolder, mountedUrl }: IDeployParams) => Promise<void>
	shutDown: ({
		token,
		mountedUrl,
	}: {
		token: string
		mountedUrl: string
	}) => Promise<void>
}) => {
	const token = core.getInput(`${tenantName}_token`)
	const { job } = github.context
	const previewUrl = core.getInput('preview_url')
	const previewPath = core.getInput('preview_path')
	const repoOwner = github.context.repo.owner.replace(/\./g, '-')
	const repoName = github.context.repo.repo.replace(/\./g, '-')
	const prNumber = await checkingPullRequestNumber()

	core.info(`Find PR number: ${prNumber}`)

	const commandUrl = previewUrl
		.replace('{{repoOwner}}', repoOwner)
		.replace('{{repoName}}', repoName)
		.replace('{{job}}', job)
		.replace('{{prNumber}}', `${prNumber}`)
		.concat(domainTenant)

	return {
		token,
		tenantName: captalize(tenantName),
		commandUrl,
		outputUrl: commandUrl.concat(previewPath),
		deploy,
		shutDown,
	}
}

const prepare = async (): Promise<IReturnPrepare> => {
	const { surgeDeploy, surgeRemoveProjectDeploy } = surge()
	const { vercelDeploy, vercelRemoveProjectDeploy } = vercel()

	const previewPath = core.getInput('preview_path')
	const distFolder = core.getInput('dist')
	const teardown =
		core.getInput('teardown')?.toString().toLowerCase() === 'true'
	const { payload } = github.context
	const gitCommitSha = getGitCommitSha()

	const tenantsList = [
		{
			...(await tenantsFactory({
				tenantName: 'surge',
				domainTenant: '.surge.sh',
				deploy: surgeDeploy,
				shutDown: surgeRemoveProjectDeploy,
			})),
		},
		{
			...(await tenantsFactory({
				tenantName: 'vercel',
				domainTenant: '.vercel.app',
				deploy: vercelDeploy,
				shutDown: vercelRemoveProjectDeploy,
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

	return {
		previewPath,
		distFolder,
		gitCommitSha,
		buildingLogUrl,
		shouldShutdown,
		tenantsList,
	}
}

export default prepare
