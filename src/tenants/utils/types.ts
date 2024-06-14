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

export interface IStatusCode {
	desc: string
	number: number
}

export interface ITraceroute {
	url: string,
	previewUrl: string | undefined
}

export interface IMapperStatusCode {
	[key: string]: IStatusCode
}
