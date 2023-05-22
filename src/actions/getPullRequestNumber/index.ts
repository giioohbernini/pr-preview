import * as core from '@actions/core'
import * as github from '@actions/github'
import { getGitCommitSha } from '..'

export default async function getPullRequestNumber(): Promise<
	number | undefined
> {
	const token = core.getInput('github_token', { required: true })
	const octokit = github.getOctokit(token)
	const { payload } = github.context
	const gitCommitSha = getGitCommitSha()
	const prNumberExists = payload.number && payload.pull_request

	if (prNumberExists) {
		return Number(payload.number)
	}

	if (!prNumberExists) {
		const result =
			await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				commit_sha: gitCommitSha,
			})
		const pr = result.data.length > 0 && result.data[0]
		core.debug('listPullRequestsAssociatedWithCommit')
		core.debug(JSON.stringify(pr, null, 2))
		const prNumber = pr ? Number(pr.number) : undefined
		return prNumber
	}
}
