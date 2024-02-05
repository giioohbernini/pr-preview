import * as core from '@actions/core'
import ping from 'ping'

// interface Cfg {
// 	timeout: number
// }

const pingStatus = async (host: string, tenantName: string) => {
	// const cfg: Cfg = { timeout: 1000 }

	const res = await ping.promise.probe(host, {
		timeout: 10,
		extra: ['-i', '2'],
	})

	const responseString = JSON.stringify(res)
	core.info(`${responseString} = ${tenantName}`)
	// const returnResponse = (res: unknown) => {
	// 	const responseString = JSON.stringify(res)
	// 	return core.info(`${responseString} = ${tenantName}`)
	// }

	// eslint-disable-next-line github/no-then
	// ping.promise.probe(host).then(returnResponse, cfg)
}

export default pingStatus
