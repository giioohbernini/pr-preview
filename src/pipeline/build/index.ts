import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { formatImage } from '../../helpers/formatImage'
import { IBuildParams } from './types'

const build = async ({ mountedUrlSurge, buildingLogUrl }: IBuildParams) => {
	const startTime = Date.now()

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
	core.info(`Deploy to ${mountedUrlSurge}`)

	const image = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90250366-88233900-de6e-11ea-95a5-84f0762ffd39.png',
	})

	return { duration, image }
}

export default build
