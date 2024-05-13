import { MapperStatusCode } from './types'

export const mapperStatusCode: MapperStatusCode = {
	200: {
		name: 'OK',
		desc: 'Request has been successfully processed',
	},
	400: {
		name: 'Bad Request',
		desc: 'The request cannot be fulfilled due to bad syntax',
	},
	401: {
		name: `Unauthorized`,
		desc: `The request was a legal request`,
	},
	404: {
		name: 'Not Found',
		desc: 'The requested page could not be found but may be available again in the future',
	},
	500: {
		name: 'Internal Server Error',
		desc: 'Internal Server Error',
	},
	default: {
		name: '',
		desc: '',
	},
}
