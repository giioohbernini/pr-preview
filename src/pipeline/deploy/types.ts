interface IDeployTenantParams {
	token: string
	distFolder: string
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
}

export interface IDeployParams {
	previewPath: string
	distFolder: string
	gitCommitSha: string
	duration: number
	image: string
	tenantsList: Tenant[]
}
