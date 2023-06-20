import * as core from '@actions/core'
import comment from './helpers/comment'
import fail from './helpers/fail'
import { formatImage } from './helpers/formatImage'
import { deployInProgressTemplate } from './helpers/commentTemplates'
import prepare from './pipeline/prepare'
import build from './pipeline/build'
import shutDown from './pipeline/shutDown'
import deploy from './pipeline/deploy'

async function main() {
	const {
		tokenList,
		previewPath,
		distFolder,
		gitCommitSha,
		buildingLogUrl,
		shouldShutdown,
		tenantSurge,
		tenantVercel,
		tenantsList,
	} = await prepare()

	if (shouldShutdown) {
		return await shutDown({
			tokenList,
			buildingLogUrl,
			tenantSurge,
			tenantVercel,
			gitCommitSha,
		})
	}

	const deployingImage = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90240294-8d2abd00-de5b-11ea-8140-4840a0b2d571.gif',
	})

	await comment(
		deployInProgressTemplate({
			gitCommitSha,
			tenantSurge,
			buildingLogUrl,
			deployingImage,
		})
	)

	try {
		const { duration, image } = await build({
			tenantSurge,
			buildingLogUrl,
		})

		await deploy({
			tokenList,
			previewPath,
			distFolder,
			gitCommitSha,
			duration,
			image,
			tenantSurge,
			tenantVercel,
			tenantsList,
		})
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
