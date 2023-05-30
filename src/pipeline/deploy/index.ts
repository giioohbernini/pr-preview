import comment from '../../helpers/comment'
import { execCommand } from '../../helpers/execCommand'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { vercelDeploy, removeSchema } from '../../tenants/vercel'

interface IDeployParams {
	vercelToken: string
	deploymentUrlVercel: string
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
	vercelToken,
	deploymentUrlVercel,
	previewPath,
	distFolder,
	mountedUrl,
	surgeToken,
	gitCommitSha,
	outputUrl,
	duration,
	image,
}: IDeployParams) => {
	if (vercelToken) {
		deploymentUrlVercel = await vercelDeploy(previewPath)
	}

	await execCommand({
		command: ['surge', `./${distFolder}`, mountedUrl, `--token`, surgeToken],
	})

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
