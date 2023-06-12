export interface IReturnPrepare {
	tokenList: { surge: string; vercel: string }
	previewPath: string
	distFolder: string
	gitCommitSha: string
	mountedUrl: string
	outputUrl: string
	buildingLogUrl: string
	shouldShutdown: boolean
}
