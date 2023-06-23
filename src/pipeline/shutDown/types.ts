import { ITenant } from '../../types'

export interface IShutDownPrams {
	gitCommitSha: string
	buildingLogUrl: string
	tenantsList: ITenant[]
}
