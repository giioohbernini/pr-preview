import type { GitHub } from '@actions/github/lib/utils'

/*global InstanceType*/
/*eslint no-undef: "error"*/

export type Octokit = InstanceType<typeof GitHub>
export type Repo = {
	owner: string
	repo: string
}

interface IDeployTenantParams {
	token: string
	distFolder: string
	mountedUrl: string
}

interface IShutDown {
	token: string
	mountedUrl: string
}

export interface ITenant {
	token: string
	tenantName: string
	commandUrl: string
	outputUrl: string
	deploy: ({
		token,
		distFolder,
		mountedUrl,
	}: IDeployTenantParams) => Promise<void>
	shutDown: ({ token, mountedUrl }: IShutDown) => Promise<void>
}
