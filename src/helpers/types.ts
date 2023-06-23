import type { Repo, Octokit, ITenant } from '../types'

interface IDeployInProgressPrams {
	gitCommitSha: string
	buildingLogUrl: string
	deployingImage: string
	tenantsList: ITenant[]
}

interface IdeployFinalized {
	gitCommitSha: string
	tenantsList: ITenant[]
	duration: number
	image: string
}

interface ICommentConfig {
	repo: Repo
	number: number
	message: string
	octokit: Octokit
	header: string
}

interface IComment {
	id: number
	node_id: string
	url: string
	body?: string | undefined
	body_text?: string | undefined
	body_html?: string | undefined
	html_url: string
	user: {
		name?: string | null | undefined
		starred_at?: string | undefined
	} | null
	reactions?: {} | undefined
}

interface IExecCommandOptions {
	command: string[]
}

interface IFormatImage {
	buildingLogUrl: string
	imageUrl: string
}

interface ICommentTenantDeployURL {
	tenantsList: ITenant[]
}

export {
	IDeployInProgressPrams,
	IdeployFinalized,
	ICommentConfig,
	IComment,
	IExecCommandOptions,
	IFormatImage,
	ICommentTenantDeployURL,
}
