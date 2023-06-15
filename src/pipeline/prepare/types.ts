import { TokenList } from '../../types'

export interface IReturnPrepare {
	tokenList: TokenList
	previewPath: string
	distFolder: string
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
	shouldShutdown: boolean
}
