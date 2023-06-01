import { execCommand } from '../helpers/execCommand'

interface ISurgeDeployParams {
	distFolder: string
	mountedUrl: string
	surgeToken: string
}

interface ISurgeRemoveProjectDeployParams {
	mountedUrl: string
	surgeToken: string
}

export const surgeDeploy = async ({
	distFolder,
	mountedUrl,
	surgeToken,
}: ISurgeDeployParams) => {
	await execCommand({
		command: ['surge', `./${distFolder}`, mountedUrl, `--token`, surgeToken],
	})
}

export const surgeRemoveProjectDeploy = async ({
	mountedUrl,
	surgeToken,
}: ISurgeRemoveProjectDeployParams) => {
	await execCommand({
		command: ['surge', 'teardown', mountedUrl, `--token`, surgeToken],
	})
}
