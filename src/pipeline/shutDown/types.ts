import { TokenList } from '../../types'

interface Tenant {
	tenantName: string
	commandUrl: string
	outputUrl: string
}

export interface IShutDownPrams {
	tokenList: TokenList
	gitCommitSha: string
	tenantSurge: Tenant
	tenantVercel: Tenant
	buildingLogUrl: string
}
