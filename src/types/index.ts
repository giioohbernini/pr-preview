import type { GitHub } from '@actions/github/lib/utils'

/*global InstanceType*/
/*eslint no-undef: "error"*/

export type Octokit = InstanceType<typeof GitHub>
export type Repo = {
	owner: string
	repo: string
}

export type TokenList = {
	surge: string
	vercel: string
}
