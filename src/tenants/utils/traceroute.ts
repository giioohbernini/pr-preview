import * as core from '@actions/core'
import { exec } from 'child_process'

const traceroute = (url: string) => {
	core.debug(`Executando traceroute:\n${url}`)
	exec(`traceroute ${url}`, (error, stdout, stderr) => {
		const output = stdout.toString()

		if (error) {
			core.error(`Erro ao executar o traceroute: ${error.message}`)
			return
		}
		if (stderr) {
			core.error(`Erro ao executar o traceroute: ${stderr}`)
			return
		}

		core.info(`:Resultado do traceroute\n${output}`)
		if (
			output.toLowerCase().includes('host not found') ||
			output.toLowerCase().includes('destination unreachable')
		) {
			core.error('Erro 404: Página não encontrada.')
		}
	})
	core.debug(`Encerrando traceroute:\n${url}`)
}

export default traceroute
