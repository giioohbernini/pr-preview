import * as core from '@actions/core'
import Traceroute from 'nodejs-traceroute-ts'
import { execCommand } from '../../helpers/execCommand'
import { IDeployParams, IShutDownParams } from '../types'
import { IVercelAssignAlias, IVercelReturn } from './types'

const tracerouteMap = (url: string) => {
	try {
		const tracer = new Traceroute()

		tracer
			.on('pid', (pid) => {
				core.debug(`pid: ${pid}`)
			})
			.on('destination', (destination) => {
				core.debug(`destination: ${destination}`)
			})
			.on('hop', (hop) => {
				core.debug(`hop: ${JSON.stringify(hop)}`)
			})
			.on('close', (code) => {
				core.debug(`close: code ${code}`)
			})

		tracer.trace(url)
	} catch (err) {
		core.debug(err)
	}
}

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

	const deploy = async ({ token, distFolder, mountedUrl }: IDeployParams) => {
		const deploymentUrl = await execCommand({
			command: [vercelCli, '--yes', '--cwd', `./${distFolder}`, '-t', token],
		})

		vercelAssignAlias({ token, deploymentUrl, mountedUrl })
		tracerouteMap(mountedUrl)
	}

	const shutDown = async ({ token, mountedUrl }: IShutDownParams) => {
		await execCommand({
			command: [vercelCli, 'remove --yes', mountedUrl, '-t', token],
		})
	}

	const returnVercelUrl = () => {
		return deploymentUrlVercel
	}

	return {
		deploy,
		shutDown,
		returnVercelUrl,
	}
}

export default vercel
