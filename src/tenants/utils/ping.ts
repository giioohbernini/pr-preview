import * as core from '@actions/core'
import { BuildTraceroute } from '@juzi/nodejs-traceroute'
// import ping from 'ping'

const pingStatus = async (host: string, tenantName: string) => {
	try {
		const tracer = BuildTraceroute()
		tracer
			.on('pid', (pid) => {
				core.info(`pid: ${pid}`)
			})
			.on('destination', (destination) => {
				core.info(`destination: ${destination}`)
			})
			.on('hop', (hop) => {
				core.info(`hop: ${JSON.stringify(hop)}`)
			})
			.on('close', (code) => {
				core.info(`close: code ${code}`)
			})

		core.info(`Tenant ${tenantName}`)
		tracer.trace(host)
	} catch (ex) {
		core.info(ex)
	}

	// setTimeout(() => {
	// 	// eslint-disable-next-line github/no-then
	// 	ping.promise.probe(`${host}`).then((res) => {
	// 		const responseString = JSON.stringify(res)
	// 		return core.info(`${responseString} = ${tenantName}`)
	// 	})
	// }, 9000)
}

export default pingStatus
