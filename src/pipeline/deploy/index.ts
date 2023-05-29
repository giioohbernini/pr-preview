import comment from '../../helpers/comment'
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

	return await comment(`
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
  `)
}

export default deploy
