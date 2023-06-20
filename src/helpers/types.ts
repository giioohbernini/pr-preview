import type { Repo, Octokit } from '../types'

interface Tenant {
	tenantName: string
	commandUrl: string
	outputUrl: string
}

interface IDeployInProgressPrams {
	gitCommitSha: string
	tenantSurge: Tenant
	buildingLogUrl: string
	deployingImage: string
}

interface IdeployFinalized {
	gitCommitSha: string
	tenantSurge: Tenant
	tenantVercel: Tenant
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
