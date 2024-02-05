import * as core from '@actions/core'
import ping from 'ping'
// import { XMLHttpRequest } from 'xmlhttprequest-ts'

const pingStatus = (host: string, tenantName: string) => {
	ping.sys.probe(host, (isAlive) => {
		let msg = isAlive
			? `host ${host} - ${tenantName} is alive`
			: `host ${host} - ${tenantName} is dead`

		core.debug(msg)
	})

	// const started = new Date().getTime()
	// const http = new XMLHttpRequest()

	// http.open('GET', host, /*async*/ true)
	// http.onreadystatechange = function () {
	// 	if (http.readyState === 4) {
	// 		const ended = new Date().getTime()
	// 		const milliseconds = ended - started
	// 		core.debug(`${tenantName} - ${milliseconds} milliseconds`)
	// 	}
	// }
	// try {
	// 	http.send(null)
	// } catch (exception) {
	// 	core.debug(exception)
	// }
}

export default pingStatus
