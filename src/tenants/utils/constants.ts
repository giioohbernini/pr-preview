import { IMapperStatusCode } from './types'

export const mapperStatusCode: IMapperStatusCode = {
	200: {
		desc: 'OK - Request has been successfully processed',
		number: 200,
	},
	400: {
		desc: 'Bad Request - The server could not understand the request due to invalid syntax.',
		number: 400,
	},
	401: {
		desc: 'Unauthorized - You do not have the necessary permissions to access this resource',
		number: 401,
	},
	404: {
		desc: 'Not Found - The requested page could not be found but may be available again in the future',
		number: 404,
	},
	500: {
		desc: 'Internal Server Error',
		number: 500,
	},
	default: {
		desc: 'We do not have the status mapped.',
		number: 0,
	},
}
