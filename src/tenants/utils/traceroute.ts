import * as core from '@actions/core'
import { exec } from 'child_process'

const traceroute = (url: string) => {
	const newUrl = url.replace('31', '13')
	core.debug(`Executando traceroute:\n${newUrl}`)
	exec(`traceroute ${newUrl}`, (error, stdout, stderr) => {
		if (error) {
			core.error(`Erro ao executar o traceroute: ${error.message}`)
			return
		}
		if (stderr) {
			core.error(`Erro ao executar o traceroute: ${stderr}`)
			return
		}
		core.info(`Resultado do traceroute:\n${stdout}`)
	})
	core.debug(`Encerrando traceroute:\n${newUrl}`)
}

export default traceroute
