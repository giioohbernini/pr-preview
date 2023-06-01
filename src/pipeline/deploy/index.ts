import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { surgeDeploy } from '../../tenants/surge'
import { vercelDeploy, removeSchema } from '../../tenants/vercel'

interface IDeployParams {
	tokenList: { surge: string; vercel: string }
	previewPath: string
	distFolder: string
	mountedUrl: string
	surgeToken: string
	gitCommitSha: string
	outputUrl: string
	duration: number
	image: string
}

const deploy = async ({
	tokenList,
	previewPath,
	distFolder,
	mountedUrl,
	gitCommitSha,
	outputUrl,
	duration,
	image,
}: IDeployParams) => {
	const { surge: surgeToken, vercel: vercelToken } = tokenList
	let deploymentUrlVercel = ''

	if (surgeToken) {
		await surgeDeploy({
			distFolder,
			mountedUrl,
			surgeToken,
		})
	}

	if (vercelToken) {
		deploymentUrlVercel = await vercelDeploy(previewPath)
	}

	await comment(
		deployFinalizedTemplate({
			gitCommitSha,
			outputUrl,
			vercelToken,
			deploymentUrlVercel,
			removeSchema,
			duration,
			image,
		})
	)
}

export default deploy
