import { ITenantReturn } from '../types'

export interface IVercelAssignAlias {
	token: string
	deploymentUrl: string
	mountedUrl: string
}

export interface IVercelReturn extends ITenantReturn {
	returnVercelUrl: () => string
}
