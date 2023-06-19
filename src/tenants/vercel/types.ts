export interface IVercelAssignAlias {
	token: string
	deploymentUrl: string
	mountedUrl: string
}

export interface IVercelDeployParams {
	token: string
	distFolder: string
	mountedUrl: string
}

export interface IVercelRemoveProjectDeploy {
	token: string
	mountedUrl: string
}

export interface IVercelReturn {
	vercelDeploy: ({
		token,
		distFolder,
		mountedUrl,
	}: IVercelDeployParams) => Promise<void>
	vercelRemoveProjectDeploy: ({
		token,
		mountedUrl,
	}: IVercelRemoveProjectDeploy) => Promise<void>
	returnVercelUrl: () => string
}
