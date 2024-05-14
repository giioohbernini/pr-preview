import { MapperStatusCode } from './types'

export const mapperStatusCode: MapperStatusCode = {
	200: 'OK - Request has been successfully processed',
	400: 'Bad Request - The server could not understand the request due to invalid syntax.',
	401: 'Unauthorized - You do not have the necessary permissions to access this resource',
	404: 'Not Found - The requested page could not be found but may be available again in the future',
	500: 'Internal Server Error',
	default: 'We do not have the status mapped.',
}
