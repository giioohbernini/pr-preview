import * as core from '@actions/core'
// import traceroute from '../../tenants/utils/traceroute'
import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'
// import { ITenant } from '../../types'

const deploy = async ({
	distFolder,
	gitCommitSha,
	duration,
	image,
	tenantsList,
}: IDeployParams) => {
	const execDeploy = new Promise((resolve) => {
		// eslint-disable-next-line github/array-foreach
		tenantsList.forEach(async (tenant, index) => {
			if (tenant.token) {
				await tenant.deploy({
					token: tenant.token,
					distFolder,
					mountedUrl: tenant.commandUrl,
				})
			}

			if (index === tenantsList.length - 1) resolve(tenantsList)
		})
	})

	execDeploy
		// eslint-disable-next-line github/no-then
		.then((tenantsListData) => {
			// eslint-disable-next-line github/array-foreach
			// tenantsListData.forEach(async (tenant) => {
			// 	tenant.statusCode = await traceroute(tenant.commandUrl)
			// })
			core.debug(`tenantsListData >>>> ${JSON.stringify(tenantsListData)}`)
			return tenantsListData
		})
		// eslint-disable-next-line github/no-then
		.then(async () => {
			core.debug(`tenantsList >>>> ${JSON.stringify(tenantsList)}`)
			await comment(
				deployFinalizedTemplate({
					gitCommitSha,
					tenantsList,
					duration,
					image,
				})
			)
		})
}

export default deploy
