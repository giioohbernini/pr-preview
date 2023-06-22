import * as Tenant from '../index'
import { Record, ITenantsFactory } from './types'
import { ISurgeReturn } from '../surge/types'

const captalize = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1)
}

const tenantsFactory = async ({
	tenantName,
	domainTenant,
	token,
	job,
	previewUrl,
	previewPath,
	repoOwner,
	repoName,
	prNumber,
}: ITenantsFactory) => {
	const { deploy, shutDown } = (
		Tenant as unknown as Record<string, ISurgeReturn>
	)[tenantName]

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

export default tenantsFactory
