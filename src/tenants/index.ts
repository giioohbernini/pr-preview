import surge from './surge'
import vercel from './vercel'
import { ITenantReturn } from './types'

export const Tenants: { [key: string]: () => ITenantReturn } = {
	surge,
	vercel,
}
