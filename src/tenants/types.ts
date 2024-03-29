export interface IDeployParams {
	token: string
	distFolder: string
	mountedUrl: string
}

export interface IShutDownParams {
	token: string
	mountedUrl: string
}

export interface ITenantReturn {
	deploy: ({ token, distFolder, mountedUrl }: IDeployParams) => Promise<void>
	shutDown: ({ token, mountedUrl }: IShutDownParams) => Promise<void>
}
