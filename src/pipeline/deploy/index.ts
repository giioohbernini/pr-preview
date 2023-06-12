import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'

interface IDeployParams {
	previewPath: string
	distFolder: string
	mountedUrl: string
	gitCommitSha: string
	outputUrl: string
	duration: number
	image: string
}

const deploy = async ({
	previewPath,
	distFolder,
	mountedUrl,
	gitCommitSha,
	outputUrl,
	duration,
	image,
}: IDeployParams) => {
	const { surgeDeploy, surgeToken } = surge()
	const { vercelDeploy, vercelToken, returnVercelUrl } = vercel()

	if (surgeToken) {
		await surgeDeploy({
			distFolder,
			mountedUrl,
		})
	}

	if (vercelToken) {
		await vercelDeploy(previewPath)
	}

	await comment(
		deployFinalizedTemplate({
			gitCommitSha,
			outputUrl,
			vercelToken,
			returnVercelUrl,
			duration,
			image,
		})
	)
}

export default deploy
