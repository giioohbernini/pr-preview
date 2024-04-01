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
	// eslint-disable-next-line github/array-foreach
	tenantsList.forEach(async (tenant) => {
		if (tenant.token) {
			tenant.statusCode = await tenant.deploy({
				token: tenant.token,
				distFolder,
				mountedUrl: tenant.commandUrl,
			})
		}
	})
	core.debug(JSON.stringify(tenantsList))
	await comment(
		deployFinalizedTemplate({
			gitCommitSha,
			tenantsList,
			duration,
			image,
		})
	)
}

export default deploy
