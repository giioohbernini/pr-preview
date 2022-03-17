import * as core from '@actions/core'
import { createComment, findPreviousComment, updateComment } from './comment'
import type { Repo, Octokit } from './types'

interface CommentConfig {
	repo: Repo
	number: number
	message: string
	octokit: Octokit
	header: string
}

export async function comment({
	repo,
	number,
	message,
	octokit,
	header,
}: CommentConfig) {
	if (isNaN(number) || number < 1) {
		core.info('no numbers given: skip step')
		return
	}
	const prefixedHeader = `: Surge Preview ${header}'`
	const body = message.replace(/\t/g, '')

	try {
		const previous = await findPreviousComment(
			octokit,
			repo,
			number,
			prefixedHeader
		)

		if (previous) {
			await updateComment(
				octokit,
				repo,
				previous.id,
				body,
				prefixedHeader,
				false
			)
		} else {
			await createComment(octokit, repo, number, body, prefixedHeader)
		}
	} catch (err) {
		core.setFailed(err.body)
	}
}
