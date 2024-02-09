import * as core from '@actions/core'
import { exec } from 'child_process'
import axios from 'axios'

// Seu código com o uso do axios

const traceroute = (url: string) => {
	const replaceUrl = url.replace('31', '13')

	core.debug(`Executando traceroute:\n${url}`)
	axios
		.get(replaceUrl)
		// eslint-disable-next-line github/no-then
		.then((response) => {
			core.info(`Status da resposta: ${response.status}`)
			if (response.status === 404) {
				core.error('Erro 404: Página não encontrada.')
			}
		})
		// eslint-disable-next-line github/no-then
		.catch((error) => {
			core.error(`Erro ao fazer a solicitação: ${error.message}`)
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
