/* eslint-disable github/no-then */
import * as core from '@actions/core'
import axios from 'axios'
import { IStatusCode, ITraceroute } from './types'
import { mapperStatusCode } from './constants'

const returnCodeMessageError = (message: string) => {
	const sizeMessage = message.length
	const positionCode = message.indexOf('code')
	const codeNumber = message.slice(positionCode + 5, sizeMessage)

	return mapperStatusCode[codeNumber] || mapperStatusCode['default']
}

const traceroute = async ({
	url,
	previewPath = '',
}: ITraceroute): Promise<IStatusCode> => {
	core.debug(`Running traceroute:\n${url}${previewPath}`)

	const errorMenssage = await axios
		.get(`https://${url}${previewPath}`)
		.then((response) => {
			core.info(`Response status: ${response.status}`)
			core.info('The website is online.')

			const status =
				mapperStatusCode[response.status] || mapperStatusCode['default']

			return status
		})
		.catch((error) => {
			core.error('The website is not online.')
			core.error(`Error: ${error.message}`)

			return returnCodeMessageError(error.message)
		})

	core.debug(`Ending traceroute:\n${url}${previewPath}`)
	return errorMenssage
}

export default traceroute
