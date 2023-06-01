import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec } from '@actions/exec'

type MyOutPut = string
type Options = Object

const workingDirectory = core.getInput('working_directory')

// vercel
const vercelCli = 'vercel'
const vercelToken = core.getInput('vercel_token')
const distFolder = core.getInput('dist')
const { job } = github.context
let deploymentUrlVercel = ''

export const removeSchema = (url: string) => {
	const regex = /^https?:\/\//
	return url.replace(regex, '')
}

let myOutput: MyOutPut = ''
let options: Options = {
	listeners: {
		stdout: (data: string): void => {
			myOutput += data.toString()
			core.info(data.toString())
		},
		stderr: (data: string): void => {
			core.info(data.toString())
		},
	},
}

export const vercelDeploy = async (previewPath: string) => {
	if (workingDirectory) {
		options = {
			...options,
			cwp: workingDirectory,
		}
	}

	await exec(
		'npx',
		[vercelCli, '--yes', '--cwd', `./${distFolder}`, '-t', vercelToken],
		options
	)

	core.info('finalizing vercel deployment')
	return myOutput.concat(previewPath)
}

export const vercelAssignAlias = async (aliasUrl: string) => {
	core.info(`Alias ${aliasUrl}`)
	const commandArguments = [
		vercelCli,
		`--token=${vercelToken}`,
		'alias',
		'set',
		deploymentUrlVercel,
		`${job}-${aliasUrl}`,
	]

	if (workingDirectory) {
		options = {
			...options,
			cwp: workingDirectory,
		}
	}

	await exec(
		'npx',
		[vercelCli, 'inspect', deploymentUrlVercel, '-t', vercelToken],
		options
	)
	const output = await exec('npx', commandArguments, options)
	core.info('finalizing vercel assign alias')
	return output
}

export const vercelRemoveProjectDeploy = async () => {
	await exec('npx', [
		vercelCli,
		'remove --yes',
		deploymentUrlVercel,
		'-t',
		vercelToken,
	])
	core.info('finalizing vercel deployment remove')
}
