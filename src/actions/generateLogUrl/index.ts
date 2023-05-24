import * as core from '@actions/core'
import * as github from '@actions/github'
import { getGitCommitSha } from '..'
import fail from '../../helpers/fail'

export default async function generateLogUrl(): Promise<string> {
	const token = core.getInput('github_token', { required: true })
	const octokit = github.getOctokit(token)
	const { job } = github.context

	const gitCommitSha = getGitCommitSha()

	let data
	try {
		const result = await octokit.rest.checks.listForRef({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			ref: gitCommitSha,
		})
		data = result.data
	} catch (err) {
		core.info('generateLogUrl error')
		await fail(err)
		return ''
	}

	core.debug(JSON.stringify(data?.check_runs, null, 2))

	let checkRunId
	if (data?.check_runs?.length >= 0) {
		const checkRun = data?.check_runs?.find((item) => item.name === job)
		checkRunId = checkRun?.id
	}

	const buildingLogUrl = checkRunId
		? `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/runs/${checkRunId}`
		: `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`

	return buildingLogUrl
}
