import * as core from '@actions/core'
import * as github from '@actions/github'
import generateLogUrl from './generateLogUrl'
import getGitCommitSha from './getGitCommitSha'
import comment from './comment'
import { formatImage } from './formatImage'

export default async function fail(err: Error) {
	core.info('error message:')
	core.info(JSON.stringify(err, null, 2))
	const repoOwner = github.context.repo.owner
	const repoName = github.context.repo.repo
	const repoId = github.context.runId
	const buildLogsUrl = `https://github.com/${repoOwner}/${repoName}/actions/runs/${repoId}`
	const buildingLogUrl = await generateLogUrl()

	const gitCommitSha = getGitCommitSha()

	const image = formatImage({
		buildingLogUrl,
		imageUrl:
			'https://user-images.githubusercontent.com/507615/90250824-4e066700-de6f-11ea-8230-600ecc3d6a6b.png',
	})

	await comment(
		`😭 Deploy PR Preview ${gitCommitSha} failed. [Build logs](${buildLogsUrl}) \n ${image}`
	)

	const failOnError = !!(
		core.getInput('failOnError') || process.env.FAIL_ON__ERROR
	)

	if (failOnError) {
		core.setFailed(err.message)
	}
}
