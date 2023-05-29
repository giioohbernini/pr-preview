import { execCommand } from '../../helpers/execCommand'
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

interface IRetornDeploy {
  commentString: string
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
}: IDeployParams): Promise<IRetornDeploy> => {
	if (vercelToken) {
		deploymentUrlVercel = await vercelDeploy(previewPath)
	}

	await execCommand({
		command: ['surge', `./${distFolder}`, mountedUrl, `--token`, surgeToken],
	})

	const commentString = `
    🎊 PR Preview ${gitCommitSha} has been successfully built and deployed
  
    <table>
      <tr>
        <td><strong>✅ Preview: Surge</strong></td>
        <td><a href='https://${outputUrl}'>${outputUrl}</a></td>
      </tr>
      ${
				vercelToken
					? `
            <tr>
              <td><strong>✅ Preview: Vercel</strong></td>
              <td><a href='${deploymentUrlVercel}'>${removeSchema(
							deploymentUrlVercel
					  )}</a></td>
            </tr>
          `
					: ''
			}
    </table>
    
    :clock1: Build time: **${duration}s** \n ${image}
  `

	return { commentString }
}

export default deploy
