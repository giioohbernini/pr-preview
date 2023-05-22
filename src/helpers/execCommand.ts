import { exec } from '@actions/exec'

interface ExecCommandOptions {
	command: string[]
}

export const execCommand = async ({
	command,
}: ExecCommandOptions): Promise<void> => {
	let myOutput = ''
	const options = {
		listeners: {
			stdout: (stdoutData: Buffer) => {
				myOutput += stdoutData.toString()
			},
		},
	}
	await exec(`npx`, command, options)
	if (myOutput && !myOutput.includes('Success')) {
		throw new Error(myOutput)
	}
}
