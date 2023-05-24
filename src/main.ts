import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { comment, fail } from './actions'
import { execCommand } from './helpers/execCommand'
import { formatImage } from './helpers/formatImage'
import {
	vercelDeploy,
	vercelRemoveProjectDeploy,
	removeSchema,
} from './tenants/vercel'
import prepare from './previewPipeline/prepare'

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

	if (teardown && payloadContext.action === 'closed') {
		try {
			core.info(`Teardown: ${mountedUrl}`)
			core.setSecret(surgeToken)
			await execCommand({
				command: ['surge', 'teardown', mountedUrl, `--token`, surgeToken],
			})

			const image = formatImage({
				buildingLogUrl,
				imageUrl:
					'https://user-images.githubusercontent.com/507615/98094112-d838f700-1ec3-11eb-8530-381c2276b80e.png',
			})

			if (vercelToken) await vercelRemoveProjectDeploy(deploymentUrlVercel)

			return await comment(
				`:recycle: [PR Preview](https://${outputUrl}) ${gitCommitSha} has been successfully destroyed since this PR has been closed. \n ${image}`
			)
		} catch (err) {
			core.info('teardown error')
			return await fail(err)
		}
	}

	const deployingImage = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90240294-8d2abd00-de5b-11ea-8140-4840a0b2d571.gif',
	})

	await comment(
		`⚡️ Deploying PR Preview ${gitCommitSha} to [surge.sh](https://${outputUrl}) ... [Build logs](${buildingLogUrl}) \n ${deployingImage}`
	)

	const startTime = Date.now()
	try {
		if (!core.getInput('build')) {
			await exec(`npm install`)
			await exec(`npm run build`)
		} else {
			const buildCommands = core.getInput('build').split('\n')
			for (const command of buildCommands) {
				core.info(`RUN: ${command}`)
				await exec(command)
			}
		}
		const duration = (Date.now() - startTime) / 1000
		core.info(`Build time: ${duration} seconds`)
		core.info(`Deploy to ${mountedUrl}`)
		core.setSecret(surgeToken)
		const image = formatImage({
			buildingLogUrl,
			imageUrl:
				'https://user-images.githubusercontent.com/507615/90250366-88233900-de6e-11ea-95a5-84f0762ffd39.png',
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
