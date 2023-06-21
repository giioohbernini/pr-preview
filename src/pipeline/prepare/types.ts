interface IDeployTenantParams {
	token: string
	distFolder: string
	mountedUrl: string
}

interface IShutDown {
	token: string
	mountedUrl: string
}

interface Tenant {
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

export interface IReturnPrepare {
	previewPath: string
	distFolder: string
	gitCommitSha: string
	buildingLogUrl: string
	shouldShutdown: boolean
	tenantsList: Tenant[]
}
