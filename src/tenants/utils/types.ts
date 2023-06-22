export type Record<K extends string | number | symbol, T> = { [P in K]: T }

export interface ITenantsFactory {
	tenantName: string
	domainTenant: string
	token: string
	job: string
	previewUrl: string
	previewPath: string
	repoOwner: string
	repoName: string
	prNumber: number | undefined
}
