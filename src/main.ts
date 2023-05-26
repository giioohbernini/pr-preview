import * as core from '@actions/core'
import comment from './helpers/comment'
import fail from './helpers/fail'
import { execCommand } from './helpers/execCommand'
import { formatImage } from './helpers/formatImage'
import { vercelDeploy, removeSchema } from './tenants/vercel'
import prepare from './pipeline/prepare'
import build from './pipeline/build'
import shutDown from './pipeline/shutDown'

async function main() {
	const {
		surgeToken,
		previewPath,
		distFolder,
		teardown,
		payloadContext,
		gitCommitSha,
		mountedUrl,
		outputUrl,
		buildingLogUrl,
		configVercel,
	} = await prepare()
	let { vercelToken, deploymentUrlVercel } = configVercel

	const shouldShutdown = teardown && payloadContext.action === 'closed'

	if (shouldShutdown) {
		return await shutDown({
			mountedUrl,
			surgeToken,
			buildingLogUrl,
			vercelToken,
			deploymentUrlVercel,
			outputUrl,
			gitCommitSha,
		})
	}

	const deployingImage = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90240294-8d2abd00-de5b-11ea-8140-4840a0b2d571.gif',
	})

	await comment(
		`⚡️ Deploying PR Preview ${gitCommitSha} to [surge.sh](https://${outputUrl}) ... [Build logs](${buildingLogUrl}) \n ${deployingImage}`
	)

	try {
		const { duration, image } = await build({
			mountedUrl,
			surgeToken,
			buildingLogUrl,
		})

		// Vercel
		if (vercelToken) {
			deploymentUrlVercel = await vercelDeploy(previewPath)
		}
		// Vercel

		await execCommand({
			command: ['surge', `./${distFolder}`, mountedUrl, `--token`, surgeToken],
		})

		await comment(`
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
	} catch (err) {
		core.info(`run command error ${err}`)
		await fail(err)
	}
}

// eslint-disable-next-line github/no-then
main().catch(async (err: Error) => {
	core.info('main error')
	await fail(err)
})
