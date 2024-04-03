import * as core from '@actions/core'
import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'

const deploy = async ({
	distFolder,
	gitCommitSha,
	duration,
	image,
	tenantsList,
}: IDeployParams) => {
	const execDeploy = new Promise<void>((resolve) => {
		// eslint-disable-next-line github/array-foreach
		tenantsList.forEach(async (tenant, index) => {
			if (tenant.token) {
				tenant.statusCode = await tenant.deploy({
					token: tenant.token,
					distFolder,
					mountedUrl: tenant.commandUrl,
				})
			}

			core.debug(`tenant >>>> ${JSON.stringify(tenantsList)}`)
			if (index === tenantsList.length - 1) resolve()
		})
	})

	// eslint-disable-next-line github/no-then
	execDeploy.then(async () => {
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
