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
	deploy: ({
		token,
		distFolder,
		mountedUrl,
	}: ISurgeDeployParams) => Promise<void>
	shutDown: ({ mountedUrl }: ISurgeRemoveProjectDeployParams) => Promise<void>
}

export { ISurgeDeployParams, ISurgeRemoveProjectDeployParams, ISurgeReturn }
