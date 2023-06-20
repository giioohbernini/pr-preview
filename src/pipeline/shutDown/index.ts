import * as core from '@actions/core'
import fail from '../../helpers/fail'
import comment from '../../helpers/comment'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'
import { formatImage } from '../../helpers/formatImage'
import { IShutDownPrams } from './types'

const shutDown = async ({
	tokenList,
	buildingLogUrl,
	tenantSurge,
	tenantVercel,
	gitCommitSha,
}: IShutDownPrams): Promise<void> => {
	try {
		const { surgeRemoveProjectDeploy } = surge()
		const { vercelRemoveProjectDeploy } = vercel()
		const { surge: surgeToken, vercel: vercelToken } = tokenList

		core.info(`Teardown: ${tenantSurge.outputUrl}`)

		if (surgeToken)
			await surgeRemoveProjectDeploy({
				token: surgeToken,
				mountedUrl: tenantSurge.commandUrl,
			})

		if (vercelToken)
			await vercelRemoveProjectDeploy({
				token: vercelToken,
				mountedUrl: tenantVercel.commandUrl,
			})

		const image = formatImage({
			buildingLogUrl,
			imageUrl:
				'https://user-images.githubusercontent.com/507615/98094112-d838f700-1ec3-11eb-8530-381c2276b80e.png',
		})

		return await comment(
			`:recycle: [PR Preview](https://${tenantSurge.outputUrl}) ${gitCommitSha} has been successfully destroyed since this PR has been closed. \n ${image}`
		)
	} catch (err) {
		core.info('teardown error')
		return await fail(err)
	}
}

export default shutDown
