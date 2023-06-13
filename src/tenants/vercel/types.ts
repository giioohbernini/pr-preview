import { TokenList } from '../../types'

export interface IVercelDeployParams {
	tokenList: TokenList
	distFolder: string
	previewPath: string
}

export interface IVercelRemoveProjectDeploy {
	tokenList: TokenList
}

export interface IVercelAssignAlias {
	tokenList: TokenList
	aliasUrl: string
}

export interface IVercelReturn {
	vercelDeploy: ({
		distFolder,
		previewPath,
	}: IVercelDeployParams) => Promise<void>
	vercelRemoveProjectDeploy: ({ tokenList }: IVercelRemoveProjectDeploy) => void
	vercelAssignAlias: ({ tokenList, aliasUrl }: IVercelAssignAlias) => void
	returnVercelUrl: () => string
}
