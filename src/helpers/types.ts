import type { Repo, Octokit, Tenant } from '../types'

interface IDeployInProgressPrams {
	gitCommitSha: string
	buildingLogUrl: string
	deployingImage: string
	tenantsList: Tenant[]
}

interface IdeployFinalized {
	gitCommitSha: string
	tenantsList: Tenant[]
	duration: number
	image: string
}

interface CommentConfig {
	repo: Repo
	number: number
	message: string
	octokit: Octokit
	header: string
}

interface Comment {
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

export {
	IDeployInProgressPrams,
	IdeployFinalized,
	CommentConfig,
	Comment,
	IExecCommandOptions,
	IFormatImage,
}
