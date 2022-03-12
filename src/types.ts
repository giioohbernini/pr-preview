import type { GitHub } from '@actions/github/lib/utils'

export type Octokit = InstanceType<typeof GitHub>
export type Repo = {
	owner: string
	repo: string
}
