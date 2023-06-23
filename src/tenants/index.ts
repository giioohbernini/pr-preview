import surge from './surge'
import vercel from './vercel'
import { ISurgeReturn } from './surge/types'

export const Tenants: { [key: string]: () => ISurgeReturn } = {
	surge,
	vercel,
}
