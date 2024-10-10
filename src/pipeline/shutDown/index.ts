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
					<p>:recycle: PR Preview ${gitCommitSha} has been successfully destroyed since this PR has been closed.</p>
					<ul>
						<li>Tenant name: ${tenant.tenantName}</li>
			      <li>Tenant URL: [${tenant.outputUrl}](https://${tenant.outputUrl})</li>
		      </ul>
			  `
			)
		})
	} catch (err) {
		core.info('teardown error')
		return await fail(err)
	}
}

export default shutDown
