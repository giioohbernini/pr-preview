interface Tenant {
	tenantName: string
	commandUrl: string
	outputUrl: string
}

export interface IBuildParams {
	tenantSurge: Tenant
	buildingLogUrl: string
}
