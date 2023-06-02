interface IDeployInProgressPrams {
	gitCommitSha: string
	outputUrl: string
	buildingLogUrl: string
	deployingImage: string
}

interface IdeployFinalized {
	gitCommitSha: string
	outputUrl: string
	vercelToken: string
	deploymentUrlVercel: string
	duration: number
	image: string
}

const removeSchema = (url: string) => {
	const regex = /^https?:\/\//
	return url.replace(regex, '')
}

export const deployInProgressTemplate = ({
	gitCommitSha,
	outputUrl,
	buildingLogUrl,
	deployingImage,
}: IDeployInProgressPrams) => {
	return `
    <p>
      ⚡️ Deploying PR Preview ${gitCommitSha} to: <a href="https://${outputUrl}">surge.sh</a> ... <a href="${buildingLogUrl}">Build logs</a>
    </p>
    <p>${deployingImage}</p>
  `
}

export const deployFinalizedTemplate = ({
	gitCommitSha,
	outputUrl,
	vercelToken,
	deploymentUrlVercel,
	duration,
	image,
}: IdeployFinalized) => {
	return `
    <p>🎊 PR Preview ${gitCommitSha} has been successfully built and deployed</p>
    <table>
      <tr>
        <td><strong>✅ Preview: Surge</strong></td>
        <td><a href='https://${outputUrl}'>${outputUrl}</a></td>
      </tr>
      ${
				vercelToken
					? `
            <tr>
              <td><strong>✅ Preview: Vercel</strong></td>
              <td><a href='${deploymentUrlVercel}'>${removeSchema(
							deploymentUrlVercel
					  )}</a></td>
            </tr>
          `
					: ''
			}
    </table>
    <p>:clock1: Build time: <b>${duration}s</b></p>
    <p>${image}</p>
  `
}
