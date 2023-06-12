import * as core from '@actions/core'
import { execCommand } from '../helpers/execCommand'

interface ISurgeDeployParams {
	distFolder: string
	mountedUrl: string
}

interface ISurgeRemoveProjectDeployParams {
	mountedUrl: string
}

interface ISurgeReturn {
	surgeToken: string
	surgeDeploy: ({ distFolder, mountedUrl }: ISurgeDeployParams) => Promise<void>
	surgeRemoveProjectDeploy: ({
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => void
}

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
