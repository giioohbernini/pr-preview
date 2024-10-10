import * as core from '@actions/core'
import fail from '../../helpers/fail'
import comment from '../../helpers/comment'
import { IShutDownPrams } from './types'

const shutDown = async ({
	gitCommitSha,
	tenantsList,
}: IShutDownPrams): Promise<void> => {
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
				`
					:recycle: PR Preview ${gitCommitSha} has been successfully destroyed since this PR has been closed. \n
					 - Tenant name: ${tenant.tenantName}
			     - Tenant URL: [${tenant.outputUrl}](https://${tenant.outputUrl})
			  `
			)
		})
	} catch (err) {
		core.info('teardown error')
		return await fail(err)
	}
}

export default shutDown
