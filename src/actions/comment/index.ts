import * as core from '@actions/core'
import * as github from '@actions/github'
import { getPullRequestNumber } from '..'
import { comment as githubComment } from '../../helpers'

export default async function comment(message: string): Promise<void> {
	const { job, payload } = github.context
	const prOwner = payload.pull_request?.owner
	const fromForkedRepo = prOwner === github.context.repo.owner
	const token = core.getInput('github_token', { required: true })
	const octokit = github.getOctokit(token)
	const prNumber = await getPullRequestNumber()

	if (fromForkedRepo) {
		return
	}

	githubComment({
		repo: github.context.repo,
		number: Number(prNumber),
		message,
		octokit,
		header: job,
	})
}
