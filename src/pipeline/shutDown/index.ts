import * as core from '@actions/core'
import fail from '../../helpers/fail'
import comment from '../../helpers/comment'
import surge from '../../tenants/surge'
import vercel from '../../tenants/vercel'
import { formatImage } from '../../helpers/formatImage'
import { IShutDownPrams } from './types'

const shutDown = async ({
	tokenList,
	mountedUrl,
	buildingLogUrl,
	outputUrl,
	gitCommitSha,
}: IShutDownPrams): Promise<void> => {
	try {
		const { surgeRemoveProjectDeploy } = surge()
		const { vercelRemoveProjectDeploy } = vercel()

		core.info(`Teardown: ${mountedUrl}`)

		if (tokenList.surge) surgeRemoveProjectDeploy({ tokenList, mountedUrl })

		if (tokenList.vercel) vercelRemoveProjectDeploy({ tokenList })

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
