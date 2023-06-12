import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { IExecCommandOptions } from './types'

export const execCommand = async ({
	command,
}: IExecCommandOptions): Promise<string> => {
	let myOutput = ''
	const options: Object = {
		listeners: {
			stdout: (data: string): void => {
				myOutput += data.toString()
				core.info(`stdout - ${data.toString()}`)
				core.info(`myOutput ${myOutput}`)
			},
			stderr: (data: string): void => {
				core.info(`stderr - ${data.toString()}`)
			},
		},
	}

	await exec(`npx`, [...command], options)

	return myOutput
}
