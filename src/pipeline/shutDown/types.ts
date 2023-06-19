import { TokenList } from '../../types'

export interface IShutDownPrams {
	tokenList: TokenList
	gitCommitSha: string
	mountedUrl: string
	mountedUrlSurge: string
	mountedUrlVercel: string
	buildingLogUrl: string
}
