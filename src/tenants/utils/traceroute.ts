import core from '@actions/core'
import { spawn } from 'child_process'

const traceroute = (url: string) => {
	core.info(`Executando traceroute:\n${url}`)
	const tracerouteProcess = spawn('traceroute', [url])

	tracerouteProcess.stdout.on('data', (data) => {
		const output = data.toString()
		core.info(`Resultado do traceroute:\n${output}`)
	})

	tracerouteProcess.stderr.on('data', (data) => {
		const error = data.toString()
		core.error(`Erro ao executar o traceroute: ${error}`)
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
	core.info(`Encerrando traceroute:\n${url}`)
}

export default traceroute
