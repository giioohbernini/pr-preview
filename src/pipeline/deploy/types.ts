import { ITenant } from '../../types'

export interface IDeployParams {
	previewPath: string
	distFolder: string
	gitCommitSha: string
	duration: number
	image: string
	tenantsList: ITenant[]
}

export interface IStatusCode {
	desc: string
	number: number
}

export interface IGetStatusParams {
	url: string
	previewUrl: string | undefined
}
