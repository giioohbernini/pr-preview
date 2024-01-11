import * as core from '@actions/core'
import Traceroute from 'nodejs-traceroute-ts'
import comment from '../../helpers/comment'
import { deployFinalizedTemplate } from '../../helpers/commentTemplates'
import { IDeployParams } from './types'

const tracerroute = (path: string) => {
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

	tracer.trace(path)
}

const deploy = async ({
	distFolder,
	gitCommitSha,
	duration,
	image,
	tenantsList,
}: IDeployParams) => {
	// eslint-disable-next-line github/array-foreach
	tenantsList.forEach(async (tenant) => {
		if (tenant.token) {
			await tenant.deploy({
				token: tenant.token,
				distFolder,
				mountedUrl: tenant.commandUrl,
			})

			tracerroute(tenant.commandUrl)
		}
	})

	await comment(
		deployFinalizedTemplate({
			gitCommitSha,
			tenantsList,
			duration,
			image,
		})
	)
}

export default deploy
