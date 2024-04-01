/* eslint-disable github/no-then */
import * as core from '@actions/core'
import axios from 'axios'

const traceroute = async (url: string): Promise<string> => {
	core.debug(`Executando traceroute:\n${url}`)

	const errorMenssage = await axios
		.get(`https://${url}`)
		.then((response) => {
			core.info(`Status da resposta: ${response.status}`)
			core.info('O site está online!')

			return response.status
		})
		.catch((error) => {
			core.error('O site não está online!')
			core.error(`Erro: ${error.message}`)

			return error
		})
	core.debug(`Encerrando traceroute:\n${url}`)

	return `${errorMenssage}`
}

export default traceroute
