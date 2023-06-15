import { TokenList } from '../../types'

export interface IVercelDeployParams {
	token: string
	distFolder: string
	previewPath: string
}

export interface IVercelRemoveProjectDeploy {
	token: string
}

export interface IVercelAssignAlias {
	tokenList: TokenList
	aliasUrl: string
}

export interface IVercelReturn {
	vercelDeploy: ({
		token,
		distFolder,
		previewPath,
	}: IVercelDeployParams) => Promise<void>
	vercelRemoveProjectDeploy: ({ token }: IVercelRemoveProjectDeploy) => void
	vercelAssignAlias: ({ tokenList, aliasUrl }: IVercelAssignAlias) => void
	returnVercelUrl: () => string
}
