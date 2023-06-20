import { TokenList } from '../../types'

interface Tenant {
	tenantName: string
	commandUrl: string
	outputUrl: string
}

export interface IDeployParams {
	tokenList: TokenList
	previewPath: string
	distFolder: string
	gitCommitSha: string
	duration: number
	image: string
	tenantSurge: Tenant
	tenantVercel: Tenant
}
