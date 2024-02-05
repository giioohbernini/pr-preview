import * as core from '@actions/core'
import ping from 'ping'

const pingStatus = (host: string, tenantName: string) => {
	setTimeout(() => {
		// eslint-disable-next-line github/no-then
		ping.promise.probe(`${host}`).then((res) => {
			const responseString = JSON.stringify(res)
			return core.info(`${responseString} = ${tenantName}`)
		})
	}, 9000)
}

export default pingStatus
