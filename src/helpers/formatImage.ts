export const formatImage = ({
	buildingLogUrl,
	imageUrl,
}: {
	buildingLogUrl: string
	imageUrl: string
}) => {
	return `<a href="${buildingLogUrl}"><img width="300" src="${imageUrl}"></a>`
}
