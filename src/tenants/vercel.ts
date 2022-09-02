import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec } from '@actions/exec'

type MyOutPut = string
type Options = Object

const { context } = github
const workingDirectory = core.getInput('working_directory')

// vercel
const vercelCli = core.getInput('vercel_cli')
const vercelToken = core.getInput('vercel_token', { required: true })
const vercelArgs = core.getInput('vercel_args')

const removeSchema = (url: string) => {
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

export const addSchema = (url: string) => {
	const regex = /^https?:\/\//
	if (!regex.test(url)) {
		return `https://${url}`
	}

	return url
}

export const vercelDeploy = async (ref: string, commit: string) => {
	if (workingDirectory) {
		options = {
			...options,
			cwp: workingDirectory,
		}
	}

	await exec(
		'npx',
		[
			vercelCli,
			...vercelArgs.split(/ +/),
			'-t',
			vercelToken,
			'-m',
			`githubCommitSha=${context.sha}`,
			'-m',
			`githubCommitAuthorName=${context.actor}`,
			'-m',
			`githubCommitAuthorLogin=${context.actor}`,
			'-m',
			'githubDeployment=1',
			'-m',
			`githubOrg=${context.repo.owner}`,
			'-m',
			`githubRepo=${context.repo.repo}`,
			'-m',
			`githubCommitOrg=${context.repo.owner}`,
			'-m',
			`githubCommitRepo=${context.repo.repo}`,
			'-m',
			`githubCommitMessage="${commit}"`,
			'-m',
			`githubCommitRef=${ref}`,
		],
		options
	)

	core.info('finalizing vercel deployment')
	return myOutput
}

export const assignAlias = async (
	deploymentUrlVercel: string,
	aliasUrl: string
) => {
	const commandArguments = [
		vercelCli,
		`--token=${vercelToken}`,
		'alias',
		'set',
		deploymentUrlVercel,
		removeSchema(aliasUrl),
	]

	if (workingDirectory) {
		options = {
			...options,
			cwp: workingDirectory,
		}
	}

	const output = await exec('npx', commandArguments, options)
	core.info('finalizing vercel assign alias')
	return output
}
