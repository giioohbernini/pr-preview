import { TokenList } from '../../types'

interface Tenant {
	token: string
	tenantName: string
	commandUrl: string
	outputUrl: string
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
