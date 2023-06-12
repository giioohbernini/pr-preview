import * as core from '@actions/core'
import { execCommand } from '../../helpers/execCommand'
import {
	ISurgeDeployParams,
	ISurgeRemoveProjectDeployParams,
	ISurgeReturn,
} from './types'

const surge = (): ISurgeReturn => {
	const surgeToken = core.getInput('surge_token')

	const surgeDeploy = async ({
		distFolder,
		mountedUrl,
	}: ISurgeDeployParams) => {
		await execCommand({
			command: ['surge', `./${distFolder}`, mountedUrl, `--token`, surgeToken],
		})
	}

	const surgeRemoveProjectDeploy = async ({
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => {
		await execCommand({
			command: ['surge', 'teardown', mountedUrl, `--token`, surgeToken],
		})
	}

	return {
		surgeToken,
		surgeDeploy,
		surgeRemoveProjectDeploy,
	}
}

export default surge
