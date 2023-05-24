import * as github from '@actions/github'

export default function getGitCommitSha(): string {
	const { payload } = github.context
	const gitCommitSha =
		payload.after ||
		payload?.pull_request?.head?.sha ||
		payload?.workflow_run?.head_sha

	return gitCommitSha
}
