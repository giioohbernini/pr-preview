interface ISurgeDeployParams {
	token: string
	distFolder: string
	mountedUrl: string
}

interface ISurgeRemoveProjectDeployParams {
	token: string
	mountedUrl: string
}

interface ISurgeReturn {
	surgeDeploy: ({ distFolder, mountedUrl }: ISurgeDeployParams) => Promise<void>
	surgeRemoveProjectDeploy: ({
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => Promise<void>
}

export { ISurgeDeployParams, ISurgeRemoveProjectDeployParams, ISurgeReturn }
