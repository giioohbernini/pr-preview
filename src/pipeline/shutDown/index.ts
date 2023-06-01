import * as core from '@actions/core'
import fail from '../../helpers/fail'
import comment from '../../helpers/comment'
import { surgeRemoveProjectDeploy } from '../../tenants/surge'
import { vercelRemoveProjectDeploy } from '../../tenants/vercel'
import { formatImage } from '../../helpers/formatImage'

interface IShutDownPrams {
	tokenList: { surge: string; vercel: string }
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
}

const shutDown = async ({
	tokenList,
	mountedUrl,
	buildingLogUrl,
	outputUrl,
	gitCommitSha,
}: IShutDownPrams): Promise<void> => {
	try {
		const { surge: surgeToken, vercel: vercelToken } = tokenList

		core.info(`Teardown: ${mountedUrl}`)
		core.setSecret(surgeToken)

		if (surgeToken) await surgeRemoveProjectDeploy({ mountedUrl, surgeToken })

		if (vercelToken) await vercelRemoveProjectDeploy()

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
