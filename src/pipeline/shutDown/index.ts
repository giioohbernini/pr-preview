import * as core from '@actions/core'
import fail from '../../helpers/fail'
import comment from '../../helpers/comment'
import { vercelRemoveProjectDeploy } from '../../tenants/vercel'
import { execCommand } from '../../helpers/execCommand'
import { formatImage } from '../../helpers/formatImage'

interface IShutDownPrams {
	surgeToken: string
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
	vercelToken: string
	deploymentUrlVercel: string
}

const shutDown = async ({
	mountedUrl,
	surgeToken,
	buildingLogUrl,
	vercelToken,
	deploymentUrlVercel,
	outputUrl,
	gitCommitSha,
}: IShutDownPrams): Promise<void> => {
	try {
		core.info(`Teardown: ${mountedUrl}`)
		core.setSecret(surgeToken)

		await execCommand({
			command: ['surge', 'teardown', mountedUrl, `--token`, surgeToken],
		})

		if (vercelToken) await vercelRemoveProjectDeploy(deploymentUrlVercel)

		const image = formatImage({
			buildingLogUrl,
			imageUrl:
				'https://user-images.githubusercontent.com/507615/98094112-d838f700-1ec3-11eb-8530-381c2276b80e.png',
		})

		return await comment(
			`:recycle: [PR Preview](https://${outputUrl}) ${gitCommitSha} has been successfully destroyed since this PR has been closed. \n ${image}`
		)
	} catch (err) {
		core.info('teardown error')
		return await fail(err)
	}
}

export default shutDown
