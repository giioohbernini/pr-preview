import core from '@actions/core'
import { spawn } from 'child_process'

const traceroute = (mountedUrl: string) => {
	core.info('Executando traceroute...')
	const tracerouteProcess = spawn('traceroute', [mountedUrl])

	tracerouteProcess.stdout.on('data', (data) => {
		core.info(`Resultado do traceroute:\n${data}`)
	})

	tracerouteProcess.stderr.on('data', (data) => {
		core.error(`Erro ao executar o traceroute: ${data}`)
	})

	tracerouteProcess.on('error', (error) => {
		core.error(`Erro ao executar o traceroute: ${error.message}`)
	})

	tracerouteProcess.on('close', (code) => {
		if (code === 0) {
			core.info('Traceroute concluído com sucesso.')
		} else {
			core.error(`O traceroute foi encerrado com o código de saída ${code}.`)
		}
	})

	// exec(`traceroute ${mountedUrl}`, (error, stdout, stderr) => {
	// 	if (error) {
	// 		core.error(`Erro ao executar o traceroute: ${error.message}`)
	// 		return
	// 	}
	// 	if (stderr) {
	// 		core.error(`Erro ao executar o traceroute: ${stderr}`)
	// 		return
	// 	}
	// 	core.info(`Resultado do traceroute:\n${stdout}`)
	// })
	core.info('Encerrando traceroute...')
}

export default traceroute
