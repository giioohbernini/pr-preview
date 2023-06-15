import { execCommand } from '../../helpers/execCommand'
import {
	ISurgeDeployParams,
	ISurgeRemoveProjectDeployParams,
	ISurgeReturn,
} from './types'

const surge = (): ISurgeReturn => {
	const surgeDeploy = async ({
		token,
		distFolder,
		mountedUrl,
	}: ISurgeDeployParams) => {
		await execCommand({
			command: ['surge', `./${distFolder}`, mountedUrl, `--token`, token],
		})
	}

	const surgeRemoveProjectDeploy = async ({
		token,
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => {
		await execCommand({
			command: ['surge', 'teardown', mountedUrl, `--token`, token],
		})
	}

	return {
		surgeDeploy,
		surgeRemoveProjectDeploy,
	}
}

export default surge
