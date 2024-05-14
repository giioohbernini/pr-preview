import traceroute from '../../tenants/utils/traceroute'
import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams, IStatusCode } from './types'

const getStatus = async (url: string): Promise<IStatusCode> => {
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

			tenant.statusCode = await getStatus(tenant.commandUrl)
		}
	}

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
