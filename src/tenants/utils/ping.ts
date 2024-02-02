import * as core from '@actions/core'
import { XMLHttpRequest } from 'xmlhttprequest-ts'

const ping = (host: string, tenantName: string) => {
	const started = new Date().getTime()
	const http = new XMLHttpRequest()

	http.open('GET', host, /*async*/ true)
	http.onreadystatechange = function () {
		if (http.readyState === 4) {
			const ended = new Date().getTime()
			const milliseconds = ended - started
			core.debug(`${tenantName} - ${milliseconds} milliseconds`)
		}
	}
	try {
		http.send(null)
	} catch (exception) {
		core.debug(exception)
	}
}

export default ping
