import { TokenList } from '../../types'

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

export interface IReturnPrepare {
	tokenList: TokenList
	previewPath: string
	distFolder: string
	gitCommitSha: string
	buildingLogUrl: string
	shouldShutdown: boolean
	tenantSurge: Tenant
	tenantVercel: Tenant
	tenantsList: Tenant[]
}
