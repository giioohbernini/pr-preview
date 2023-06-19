import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'

const deploy = async ({
	tokenList,
	previewPath,
	distFolder,
	gitCommitSha,
	duration,
	image,
	mountedUrlSurge,
	mountedUrlVercel,
}: IDeployParams) => {
	const { surgeDeploy } = surge()
	const { vercelDeploy } = vercel()
	const { surge: surgeToken, vercel: vercelToken } = tokenList

	if (surgeToken) {
		await surgeDeploy({
			token: surgeToken,
			distFolder,
			mountedUrl: mountedUrlSurge,
		})
	}

	if (vercelToken) {
		await vercelDeploy({
			token: vercelToken,
			distFolder,
			mountedUrl: mountedUrlVercel,
		})
	}

	await comment(
		deployFinalizedTemplate({
			tokenList,
			previewPath,
			gitCommitSha,
			mountedUrlSurge,
			mountedUrlVercel,
			duration,
			image,
		})
	)
}

export default deploy
