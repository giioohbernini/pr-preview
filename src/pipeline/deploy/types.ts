import { TokenList } from '../../types'

export interface IDeployParams {
	tokenList: TokenList
	previewPath: string
	distFolder: string
	mountedUrl: string
	gitCommitSha: string
	duration: number
	image: string
	mountedUrlSurge: string
	mountedUrlVercel: string
}
