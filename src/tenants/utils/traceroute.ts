/* eslint-disable github/no-then */
import * as core from '@actions/core'
// import { exec } from 'child_process'
import axios from 'axios'

const traceroute = (url: string) => {
	core.debug(`Executando traceroute:\n${url}`)

	axios
		.get(`https://${url.replace('giioohbernini', 'giioohberninii')}`)
		.then((response) => {
			core.info(`Status da resposta: ${response.status}`)
			core.info('O site está online!')
		})
		.catch((error) => {
			core.error('O site não está online!')
			core.error(`Erro: ${error.message}`)
		})

	// exec(`traceroute ${host}`, (error, stdout, stderr) => {
	// 	if (error) {
	// 		core.error(`Erro ao executar o traceroute: ${error.message}`)
	// 		return
	// 	}
	// 	if (stderr) {
	// 		core.error(`Erro ao executar o traceroute: ${stderr}`)
	// 		return
	// 	}

	// 	const output = stdout.toString()
	// 	core.info(`:Resultado do traceroute\n${output}`)
	// 	if (
	// 		output.toLowerCase().includes('host not found') ||
	// 		output.toLowerCase().includes('destination unreachable')
	// 	) {
	// 		core.error('Erro 404: Página não encontrada.')
	// 	}
	// })
	core.debug(`Encerrando traceroute:\n${url}`)
}

export default traceroute
