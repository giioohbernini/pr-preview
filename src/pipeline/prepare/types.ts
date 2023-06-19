import { TokenList } from '../../types'

export interface IReturnPrepare {
	tokenList: TokenList
	previewPath: string
	distFolder: string
	gitCommitSha: string
	buildingLogUrl: string
	shouldShutdown: boolean
	mountedUrlSurge: string
	mountedUrlVercel: string
}
