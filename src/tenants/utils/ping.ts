import * as core from '@actions/core'
import ping from 'ping'

const pingStatus = (host: string, tenantName: string) => {
	const replaceHost = host.replace('31', '333')
	// eslint-disable-next-line github/no-then
	ping.promise.probe(replaceHost).then((res) => {
		const responseString = JSON.stringify(res)
		return core.info(`${responseString} = ${tenantName}`)
	})
}

export default pingStatus
