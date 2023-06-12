import * as core from '@actions/core'
import * as github from '@actions/github'
import { execCommand } from '../helpers/execCommand'

interface IVercelReturn {
	vercelToken: string
	vercelDeploy: (previewPath: string) => void
	vercelRemoveProjectDeploy: () => void
	vercelAssignAlias: (aliasUrl: string) => void
	returnVercelUrl: () => string
}

const vercel = (): IVercelReturn => {
	const vercelToken = core.getInput('vercel_token')
	const vercelCli = 'vercel'
	const distFolder = core.getInput('dist')
	const { job } = github.context
	let deploymentUrlVercel = ''

	const vercelDeploy = async (previewPath: string) => {
		const outputPath = await execCommand({
			command: [
				vercelCli,
				'--yes',
				'--cwd',
				`./${distFolder}`,
				'-t',
				vercelToken,
			],
		})

		deploymentUrlVercel = outputPath.concat(previewPath)
		core.info(`Deployment Url Vercel - ${deploymentUrlVercel}`)
		core.info('finalizing vercel deployment')
	}

	const vercelRemoveProjectDeploy = async () => {
		await execCommand({
			command: [
				vercelCli,
				'remove --yes',
				deploymentUrlVercel,
				'-t',
				vercelToken,
			],
		})

		core.info(`Vercel Remove Project Deploy - ${deploymentUrlVercel}`)
		core.info('finalizing vercel deployment remove')
	}

	const vercelAssignAlias = async (aliasUrl: string) => {
		core.info(`Alias ${aliasUrl}`)

		await execCommand({
			command: [vercelCli, 'inspect', deploymentUrlVercel, '-t', vercelToken],
		})

		const output = await execCommand({
			command: [
				vercelCli,
				`--token=${vercelToken}`,
				'alias',
				'set',
				deploymentUrlVercel,
				`${job}-${aliasUrl}`,
			],
		})

		core.info('finalizing vercel assign alias')
		return output
	}

	const returnVercelUrl = () => {
		return deploymentUrlVercel
	}

	return {
		vercelToken,
		vercelDeploy,
		vercelRemoveProjectDeploy,
		vercelAssignAlias,
		returnVercelUrl,
	}
}

export default vercel
