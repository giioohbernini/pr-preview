import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'

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
	const { surgeDeploy } = surge()
	const { vercelDeploy, returnVercelUrl } = vercel()

	if (tokenList.surge) {
		await surgeDeploy({
			tokenList,
			distFolder,
			mountedUrl,
		})
	}

	if (tokenList.vercel) {
		await vercelDeploy({
			tokenList,
			distFolder,
			previewPath,
		})
	}

	await comment(
		deployFinalizedTemplate({
			tokenList,
			gitCommitSha,
			outputUrl,
			returnVercelUrl,
			duration,
			image,
		})
	)
}

export default deploy
