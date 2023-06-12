export interface IVercelReturn {
	vercelToken: string
	vercelDeploy: (previewPath: string) => Promise<void>
	vercelRemoveProjectDeploy: () => void
	vercelAssignAlias: (aliasUrl: string) => void
	returnVercelUrl: () => string
}
