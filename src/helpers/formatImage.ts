import { IFormatImage } from './types'

export const formatImage = ({ buildingLogUrl, imageUrl }: IFormatImage) => {
	return `<a href="${buildingLogUrl}"><img width="300" src="${imageUrl}"></a>`
}
