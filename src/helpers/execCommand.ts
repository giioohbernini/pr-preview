import * as core from '@actions/core'
import { exec } from '@actions/exec'

interface ExecCommandOptions {
	command: string[]
}

export const execCommand = async ({
	command,
}: ExecCommandOptions): Promise<string> => {
	let myOutput = ''
	const options: Object = {
		listeners: {
			stdout: (data: string): void => {
				myOutput += data.toString()
				core.info(`stdout - ${data.toString()}`)
			},
			stderr: (data: string): void => {
				core.info(`stderr - ${data.toString()}`)
			},
			// stdout: (stdoutData: Buffer) => {
			// 	myOutput += stdoutData.toString()
			// },
		},
	}
	await exec(`npx`, command, options)
	if (myOutput && !myOutput.includes('Success')) {
		throw new Error(myOutput)
	}

	return myOutput
}
