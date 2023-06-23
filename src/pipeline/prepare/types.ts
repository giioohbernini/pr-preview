import { ITenant } from '../../types'

interface IDeployParams {
	token: string
	distFolder: string
	mountedUrl: string
}

export interface ITenantsFactory {
	tenantName: string
	domainTenant: string
	deploy: ({ token, distFolder, mountedUrl }: IDeployParams) => Promise<void>
	shutDown: ({
		token,
		mountedUrl,
	}: {
		token: string
		mountedUrl: string
	}) => Promise<void>
}

export interface IReturnPrepare {
	previewPath: string
	distFolder: string
	gitCommitSha: string
	buildingLogUrl: string
	shouldShutdown: boolean
	tenantsList: ITenant[]
}
