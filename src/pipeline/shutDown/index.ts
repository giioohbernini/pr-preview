import * as core from '@actions/core'
import fail from '../../helpers/fail'
import comment from '../../helpers/comment'
import { formatImage } from '../../helpers/formatImage'
import { IShutDownPrams } from './types'

const shutDown = async ({
	buildingLogUrl,
	gitCommitSha,
	tenantsList,
}: IShutDownPrams): Promise<void> => {
	const image = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/98094112-d838f700-1ec3-11eb-8530-381c2276b80e.png',
	})

	try {
		// eslint-disable-next-line github/array-foreach
		return tenantsList.forEach(async (tenant) => {
			core.info(`Teardown: ${tenant.outputUrl}`)

			if (tenant.token) {
				await tenant.shutDown({
					token: tenant.token,
					mountedUrl: tenant.commandUrl,
				})
			}

			return await comment(
				`:recycle: [PR Preview](https://${tenant.outputUrl}) ${gitCommitSha} has been successfully destroyed since this PR has been closed. \n ${image}`
			)
		})
	} catch (err) {
		core.info('teardown error')
		return await fail(err)
	}
}

export default shutDown
