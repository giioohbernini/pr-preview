import * as core from '@actions/core'
import traceroute from '../../tenants/utils/traceroute'
import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'
import { ITenant } from '../../types'

const getStatus = async (url: string): Promise<string> => {
	return new Promise(async (resolve) => {
		const statusCode = await traceroute(url)

		if (statusCode) resolve(statusCode)
	})
}

const deploy = async ({
	distFolder,
	gitCommitSha,
	duration,
	image,
	tenantsList,
}: IDeployParams) => {
	for (let tenant of tenantsList) {
		if (tenant.token) {
			await tenant.deploy({
				token: tenant.token,
				distFolder,
				mountedUrl: tenant.commandUrl,
			})
			const status = await getStatus(tenant.commandUrl)
			tenant.statusCode = status
			core.debug(
				`status >>>> ${JSON.stringify(tenant)} ${JSON.stringify(status)}`
			)
		}
	}

	core.debug(`tenantsList >>>> ${JSON.stringify(tenantsList)}`)
	await comment(
		deployFinalizedTemplate({
			gitCommitSha,
			tenantsList,
			duration,
			image,
		})
	)

	// const execDeploy = new Promise<ITenant[]>((resolve) => {
	// 	// eslint-disable-next-line github/array-foreach
	// 	tenantsList.forEach(async (tenant, index) => {
	// 		if (tenant.token) {
	// 			await tenant.deploy({
	// 				token: tenant.token,
	// 				distFolder,
	// 				mountedUrl: tenant.commandUrl,
	// 			})

	// 			// tenant.statusCode = await traceroute(tenant.commandUrl)
	// 		}

	// 		if (index === tenantsList.length - 1) resolve(tenantsList)
	// 	})
	// })

	// execDeploy
	// eslint-disable-next-line github/no-then
	// .then(async (tenantsListData) => {
	// 	core.debug(`tenantsListData 2 >>>> ${JSON.stringify(tenantsListData)}`)
	// 	await comment(
	// 		deployFinalizedTemplate({
	// 			gitCommitSha,
	// 			tenantsList: tenantsListData,
	// 			duration,
	// 			image,
	// 		})
	// 	)
	// })
}

export default deploy
