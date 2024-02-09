import * as core from '@actions/core'
import { exec } from 'child_process'

const host = 'example404.com'

const traceroute = (url: string) => {
	core.debug(`Executando traceroute:\n${url}`)
	exec(`curl -I ${host}`, (error, stdout, stderr) => {
		if (error) {
			core.error(`Erro ao executar o curl: ${error.message}`)
			return
		}
		if (stderr) {
			core.error(`Erro ao executar o curl: ${stderr}`)
			return
		}

		const output = stdout.toString() // Converte a saída para string
		core.info(`Resultado do curl:\n${output}`)

		// Verifica se há indícios de erro 404 na saída
		if (output.includes('HTTP/1.1 404 Not Found')) {
			core.error('Erro 404: Página não encontrada.')
		}
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
