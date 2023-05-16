import * as core from '@actions/core'
import * as github from '@actions/github'
import { WebhookPayload } from '@actions/github/lib/interfaces'

interface BuildParams {
	previewUrl: string
	jobContext: string
	prNumber: number
	previewPath: string
	generateLogUrl: () => Promise<string>
	teardown: boolean
	payloadContext: WebhookPayload
}

const build = async ({
	previewUrl,
	jobContext,
	prNumber,
	previewPath,
	generateLogUrl,
	teardown,
	payloadContext,
}: BuildParams) => {
	const repoOwner = github.context.repo.owner.replace(/\./g, '-')
	const repoName = github.context.repo.repo.replace(/\./g, '-')
	const mountedPreviewRrl = previewUrl
		.replace('{{repoOwner}}', repoOwner)
		.replace('{{repoName}}', repoName)
		.replace('{{job}}', jobContext)
		.replace('{{prNumber}}', `${prNumber}`)
		.concat('.surge.sh')

	const outputUrl = mountedPreviewRrl.concat(previewPath)

	core.setOutput('preview_url', outputUrl)

	const buildingLogUrl = await generateLogUrl()

	core.debug(`teardown enabled?: ${teardown}`)
	core.debug(`event action?: ${payloadContext.action}`)

	return {
		mountedPreviewRrl,
		outputUrl,
		buildingLogUrl,
	}
}

export default build
