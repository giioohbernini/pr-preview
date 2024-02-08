import core from '@actions/core'
import { exec } from 'child_process'

const traceroute = (mountedUrl: string) => {
	core.info('Executando traceroute...')
	exec(`traceroute ${mountedUrl}`, (error, stdout, stderr) => {
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
	core.info('Encerrando traceroute...')
}

export default traceroute
