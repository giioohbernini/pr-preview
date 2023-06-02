import * as core from '@actions/core'
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
	const { vercelDeploy, vercelToken, deploymentUrlVercel } = vercel()

	if (surgeToken) {
		core.info('Starting surge deploy')
		surgeDeploy({
			distFolder,
			mountedUrl,
		})
	}

	if (vercelToken) {
		core.info(`Starting vercel deploy - ${deploymentUrlVercel}`)
		vercelDeploy(previewPath)
	}

	await comment(
		deployFinalizedTemplate({
			gitCommitSha,
			outputUrl,
			vercelToken,
			deploymentUrlVercel,
			duration,
			image,
		})
	)
}

export default deploy
