import ping from '../utils/ping'
import { execCommand } from '../../helpers/execCommand'
import { IDeployParams, IShutDownParams, ITenantReturn } from '../types'

const surge = (): ITenantReturn => {
	const deploy = async ({ token, distFolder, mountedUrl }: IDeployParams) => {
		await execCommand({
			command: ['surge', `./${distFolder}`, mountedUrl, `--token`, token],
		})

		ping(mountedUrl)
	}

	const shutDown = async ({ token, mountedUrl }: IShutDownParams) => {
		await execCommand({
			command: ['surge', 'teardown', mountedUrl, `--token`, token],
		})
	}

	return {
		deploy,
		shutDown,
	}
}

export default surge
