import { TokenList } from '../../types'

export interface IShutDownPrams {
	tokenList: TokenList
	gitCommitSha: string
	mountedUrlSurge: string
	mountedUrlVercel: string
	buildingLogUrl: string
}
