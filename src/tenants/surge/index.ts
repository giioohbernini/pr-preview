// import traceroute from '../utils/traceroute'
import { execCommand } from '../../helpers/execCommand'
import { IDeployParams, IShutDownParams, ITenantReturn } from '../types'

const surge = (): ITenantReturn => {
	const deploy = async ({ token, distFolder, mountedUrl }: IDeployParams) => {
		await execCommand({
			command: ['surge', `./${distFolder}`, mountedUrl, `--token`, token],
		})
		// const statusCode = traceroute(mountedUrl)

		// return statusCode
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
