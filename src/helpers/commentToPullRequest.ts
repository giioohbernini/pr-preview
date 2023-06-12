import * as core from '@actions/core'
import type { Repo, Octokit } from '../types'
import { CommentConfig, Comment } from './types'

function headerComment(header?: string) {
	return `<!-- Sticky Pull Request Comment${header || ''} -->`
}

async function findPreviousComment(
	octokit: Octokit,
	repo: Repo,
	issue_number: number,
	header?: string
) {
	const { data: comments } = await octokit.rest.issues.listComments({
		...repo,
		issue_number,
	})
	const h = headerComment(header)
	return comments.find((comment: Comment) => comment.body?.includes(h))
}

async function updateComment(
	octokit: Octokit,
	repo: Repo,
	comment_id: number,
	body: string,
	header?: string,
	previousBody?: string | false
) {
	await octokit.rest.issues.updateComment({
		...repo,
		comment_id,
		body: previousBody
			? `${previousBody}\n${body}`
			: `${body}\n${headerComment(header)}`,
	})
}

async function createComment(
	octokit: Octokit,
	repo: Repo,
	issue_number: number,
	body: string,
	header?: string,
	previousBody?: string | false
) {
	await octokit.rest.issues.createComment({
		...repo,
		issue_number,
		body: previousBody
			? `${previousBody}\n${body}`
			: `${body}\n${headerComment(header)}`,
	})
}

export async function commentToPullRequest({
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
	const body = message.replace(/\s+/g, ' ')

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
