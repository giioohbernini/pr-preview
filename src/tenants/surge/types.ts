import { TokenList } from '../../types'

interface ISurgeDeployParams {
	tokenList: TokenList
	distFolder: string
	mountedUrl: string
}

interface ISurgeRemoveProjectDeployParams {
	tokenList: TokenList
	mountedUrl: string
}

interface ISurgeReturn {
	surgeDeploy: ({ distFolder, mountedUrl }: ISurgeDeployParams) => Promise<void>
	surgeRemoveProjectDeploy: ({
		mountedUrl,
	}: ISurgeRemoveProjectDeployParams) => void
}

export { ISurgeDeployParams, ISurgeRemoveProjectDeployParams, ISurgeReturn }
