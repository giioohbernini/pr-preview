interface ISurgeDeployParams {
	distFolder: string
	mountedUrl: string
}

interface ISurgeRemoveProjectDeployParams {
	mountedUrl: string
}

interface ISurgeReturn {
	surgeToken: string
	surgeDeploy: ({ distFolder, mountedUrl }: ISurgeDeployParams) => Promise<void>
	surgeRemoveProjectDeploy: ({
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => void
}

export { ISurgeDeployParams, ISurgeRemoveProjectDeployParams, ISurgeReturn }
