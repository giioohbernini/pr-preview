import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'
// import surge from '../../tenants/surge'
// import vercel from '../../tenants/vercel'

const deploy = async ({
	// tokenList,
	distFolder,
	gitCommitSha,
	duration,
	image,
	// tenantSurge,
	// tenantVercel,
	tenantsList,
}: IDeployParams) => {
	// const { surgeDeploy } = surge()
	// const { vercelDeploy } = vercel()
	// const { surge: surgeToken, vercel: vercelToken } = tokenList

	// eslint-disable-next-line github/array-foreach
	tenantsList.forEach(async (tenant) => {
		if (tenant.token) {
			await tenant.deploy({
				token: tenant.token,
				distFolder,
				mountedUrl: tenant.commandUrl,
			})
		}
	})

	// if (surgeToken) {
	// 	await surgeDeploy({
	// 		token: surgeToken,
	// 		distFolder,
	// 		mountedUrl: tenantSurge.commandUrl,
	// 	})
	// }

	// if (vercelToken) {
	// 	await vercelDeploy({
	// 		token: vercelToken,
	// 		distFolder,
	// 		mountedUrl: tenantVercel.commandUrl,
	// 	})
	// }

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
