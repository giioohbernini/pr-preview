import { execCommand } from '../../helpers/execCommand'
import {
	IVercelDeployParams,
	IVercelRemoveProjectDeploy,
	IVercelAssignAlias,
	IVercelReturn,
} from './types'

const vercel = (): IVercelReturn => {
	const vercelCli = 'vercel'
	let deploymentUrlVercel = ''

	const vercelAssignAlias = async ({
		token,
		deploymentUrl,
		mountedUrl,
	}: IVercelAssignAlias) => {
		await execCommand({
			command: [
				vercelCli,
				'alias',
				'set',
				deploymentUrl,
				`${mountedUrl}`,
				`--token=${token}`,
			],
		})
	}

	const vercelDeploy = async ({
		token,
		distFolder,
		mountedUrl,
	}: IVercelDeployParams) => {
		const deploymentUrl = await execCommand({
			command: [vercelCli, '--yes', '--cwd', `./${distFolder}`, '-t', token],
		})

		vercelAssignAlias({ token, deploymentUrl, mountedUrl })
	}

	const vercelRemoveProjectDeploy = async ({
		token,
	}: IVercelRemoveProjectDeploy) => {
		await execCommand({
			command: [vercelCli, 'remove --yes', deploymentUrlVercel, '-t', token],
		})
	}

	const returnVercelUrl = () => {
		return deploymentUrlVercel
	}

	return {
		vercelDeploy,
		vercelRemoveProjectDeploy,
		returnVercelUrl,
	}
}

export default vercel
