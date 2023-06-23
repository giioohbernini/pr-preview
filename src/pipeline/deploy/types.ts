import { ITenant } from '../../types'

export interface IDeployParams {
	previewPath: string
	distFolder: string
	gitCommitSha: string
	duration: number
	image: string
	tenantsList: ITenant[]
}
