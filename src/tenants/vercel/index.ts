import * as github from '@actions/github'
import { execCommand } from '../../helpers/execCommand'
import {
	IVercelDeployParams,
	IVercelRemoveProjectDeploy,
	IVercelAssignAlias,
	IVercelReturn,
} from './types'

const vercel = (): IVercelReturn => {
	const vercelCli = 'vercel'
	const { job } = github.context
	let deploymentUrlVercel = ''

	const vercelDeploy = async ({
		token,
		distFolder,
		previewPath,
	}: IVercelDeployParams) => {
		const outputPath = await execCommand({
			command: [vercelCli, '--yes', '--cwd', `./${distFolder}`, '-t', token],
		})

		deploymentUrlVercel = outputPath.concat(previewPath)
	}

	const vercelRemoveProjectDeploy = async ({
		token,
	}: IVercelRemoveProjectDeploy) => {
		await execCommand({
			command: [vercelCli, 'remove --yes', deploymentUrlVercel, '-t', token],
		})
	}

	const vercelAssignAlias = async ({
		tokenList,
		aliasUrl,
	}: IVercelAssignAlias) => {
		await execCommand({
			command: [
				vercelCli,
				'inspect',
				deploymentUrlVercel,
				'-t',
				tokenList.vercel,
			],
		})

		const output = await execCommand({
			command: [
				vercelCli,
				`--token=${tokenList.vercel}`,
				'alias',
				'set',
				deploymentUrlVercel,
				`${job}-${aliasUrl}`,
			],
		})

		return output
	}

	const returnVercelUrl = () => {
		return deploymentUrlVercel
	}

	return {
		vercelDeploy,
		vercelRemoveProjectDeploy,
		vercelAssignAlias,
		returnVercelUrl,
	}
}

export default vercel
