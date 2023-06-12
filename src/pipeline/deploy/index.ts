import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'

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
