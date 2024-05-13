/* eslint-disable github/no-then */
import * as core from '@actions/core'
import axios from 'axios'
import { mapperStatusCode } from './constants'

const returnCodeMessageError = (message: string) => {
	const sizeMessage = message.length
	const positionCode = message.indexOf('code')
	const codeNumber = message.slice(positionCode + 5, sizeMessage)

	return mapperStatusCode[codeNumber].desc || mapperStatusCode['default'].desc
}

const traceroute = async (url: string): Promise<string> => {
	core.debug(`Running traceroute:\n${url}`)

	const errorMenssage = await axios
		.get(`https://${url}`)
		.then((response) => {
			core.info(`Response status: ${response.status}`)
			core.info('The website is online.')

			const status =
				mapperStatusCode[response.status].desc || mapperStatusCode['default'].desc

			return `${status}`
		})
		.catch((error) => {
			core.error('The website is not online.')
			core.error(`Error: ${error.message}`)
			
			return returnCodeMessageError(error.message)
		})

	core.debug(`Ending traceroute:\n${url}`)
	return `${errorMenssage}`
}

export default traceroute
