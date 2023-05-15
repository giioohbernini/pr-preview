import * as core from '@actions/core'
import * as github from '@actions/github'
import { WebhookPayload } from '@actions/github/lib/interfaces'

interface ParansPrepare {
	getPullRequestNumber: () => Promise<number | undefined>
	getGitCommitSha: () => string
}

interface VariablesPrepare {
	surgeToken: string
	previewUrl: string
	previewPath: string
	distFolder: string
	teardown: boolean
	prNumber: number | undefined
	jobContext: string
	payloadContext: WebhookPayload
	gitCommitSha: string
}

interface Factory {
	factory: () => VariablesPrepare
}

const prepare = async ({
	getPullRequestNumber,
	getGitCommitSha,
}: ParansPrepare): Promise<Factory> => {
	const surgeToken = core.getInput('surge_token')
	const previewUrl = core.getInput('preview_url')
	const previewPath = core.getInput('preview_path')
	const distFolder = core.getInput('dist')
	const teardown =
		core.getInput('teardown')?.toString().toLowerCase() === 'true'
	const prNumber = await getPullRequestNumber()
	core.debug('github.context')
	core.debug(JSON.stringify(github.context, null, 2))

	const { job, payload } = github.context
	core.debug(`payload.after: ${payload.after}`)
	core.debug(`payload.after: ${payload.pull_request}`)

	const gitCommitSha = getGitCommitSha()
	core.debug(JSON.stringify(github.context.repo, null, 2))

	core.info('Finalizing the initialization of the variables.')

	return {
		factory: () => {
			return {
				surgeToken,
				previewUrl,
				previewPath,
				distFolder,
				teardown,
				prNumber,
				jobContext: job,
				payloadContext: payload,
				gitCommitSha,
			}
		},
	}
}

export default prepare
