import { execCommand } from '../../helpers/execCommand'
import {
	ISurgeDeployParams,
	ISurgeRemoveProjectDeployParams,
	ISurgeReturn,
} from './types'

const surge = (): ISurgeReturn => {
	const deploy = async ({
		token,
		distFolder,
		mountedUrl,
	}: ISurgeDeployParams) => {
		await execCommand({
			command: ['surge', `./${distFolder}`, mountedUrl, `--token`, token],
		})
	}

	const shutDown = async ({
		token,
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => {
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
