import { execCommand } from '../../helpers/execCommand'
import {
	ISurgeDeployParams,
	ISurgeRemoveProjectDeployParams,
	ISurgeReturn,
} from './types'

const surge = (): ISurgeReturn => {
	const surgeDeploy = async ({
		tokenList,
		distFolder,
		mountedUrl,
	}: ISurgeDeployParams) => {
		await execCommand({
			command: [
				'surge',
				`./${distFolder}`,
				mountedUrl,
				`--token`,
				tokenList.surge,
			],
		})
	}

	const surgeRemoveProjectDeploy = async ({
		tokenList,
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => {
		await execCommand({
			command: ['surge', 'teardown', mountedUrl, `--token`, tokenList.surge],
		})
	}

	return {
		surgeDeploy,
		surgeRemoveProjectDeploy,
	}
}

export default surge
