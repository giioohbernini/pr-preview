/* eslint-disable github/no-then */
import * as core from '@actions/core'
import axios from 'axios'

const traceroute = (url: string) => {
	core.debug(`Executando traceroute:\n${url}`)

	axios
		.get(`https://${url}`)
		.then((response) => {
			core.info(`Status da resposta: ${response.status}`)
			core.info('O site está online!')
		})
		.catch((error) => {
			core.error('O site não está online!')
			core.error(`Erro: ${error.message}`)
		})
	core.debug(`Encerrando traceroute:\n${url}`)
}

export default traceroute
