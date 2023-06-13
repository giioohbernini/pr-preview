import { TokenList } from '../../types'

export interface IShutDownPrams {
	tokenList: TokenList
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
}
