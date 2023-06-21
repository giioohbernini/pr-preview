import { Tenant } from '../../types'

export interface IShutDownPrams {
	gitCommitSha: string
	buildingLogUrl: string
	tenantsList: Tenant[]
}
