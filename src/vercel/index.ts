import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec } from '@actions/exec'

type MyOutPut = string
type Options = Object

export const vercelInspect = async (deploymentUrl: string) => {
	const workingDirectory = core.getInput('working-directory')
	const vercelToken = core.getInput('vercel_token', { required: true })

	let myOutput = ''
	let myError = ''
	let options: Options = {
		listeners: {
			stdout: (data: string) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				myOutput += data.toString()
				core.info(data.toString())
			},
			stderr: (data: string) => {
				myError += data.toString()
				core.info(data.toString())
			},
		},
	}
	if (workingDirectory) {
		options = {
			...options,
			cwp: workingDirectory,
		}
	}
	const args = ['vercel', 'inspect', deploymentUrl, '-t --yes', vercelToken]
	await exec('npx', args, options)

	const match = myError.match(/^\s+name\s+(.+)$/m)
	return match && match.length ? match[1] : null
}

export const vercelDeploy = async (ref: string, commit: string) => {
	const { context } = github
	const workingDirectory = core.getInput('working-directory')

	// vercel
	const vercelCli = core.getInput('vercel_cli')
	const vercelToken = core.getInput('vercel_token', { required: true })
	const vercelArgs = core.getInput('vercel_args')
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
