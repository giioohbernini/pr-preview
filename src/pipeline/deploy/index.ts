import traceroute from '../../tenants/utils/traceroute'
import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams, IStatusCode, IGetStatusParams } from './types'

const getStatus = async ({
	url,
	previewPath,
}: IGetStatusParams): Promise<IStatusCode> => {
	return new Promise(async (resolve) => {
		const statusCode = await traceroute({ url, previewPath })

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

			tenant.statusCode = await getStatus({
				url: tenant.commandUrl,
				previewPath: tenant.previewPath,
			})
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
