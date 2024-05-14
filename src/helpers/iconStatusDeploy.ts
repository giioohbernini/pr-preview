export const iconStatusDeploy = (code: number | undefined) => {
	let icon = ''

	switch (code) {
		case 400:
			icon = '\u274C'
			break
		case 401:
			icon = '\u274C'
			break
		case 404:
			icon = '\u274C'
			break
		case 500:
			icon = '\u274C'
			break
		default:
			icon = '\u2705'
			break
	}

	return icon
}
