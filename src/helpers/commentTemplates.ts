import { IDeployInProgressPrams, IdeployFinalized } from './types'

export const deployInProgressTemplate = ({
	gitCommitSha,
	tenantSurge,
	buildingLogUrl,
	deployingImage,
}: IDeployInProgressPrams) => {
	return `
    <p>
      ⚡️ Deploying PR Preview ${gitCommitSha} to: <a href="https://${tenantSurge.outputUrl}">surge.sh</a> ... <a href="${buildingLogUrl}">Build logs</a>
    </p>
    <p>${deployingImage}</p>
  `
}

export const deployFinalizedTemplate = ({
	gitCommitSha,
	tenantsList,
	duration,
	image,
}: IdeployFinalized) => {
	return `
    <p>🎊 PR Preview ${gitCommitSha} has been successfully built and deployed</p>
    <table>
      ${tenantsList.map((tenant) => {
				tenant.token
					? `
					<tr>
						<td><strong>✅ Preview: ${tenant.tenantName}</strong></td>
						<td><a href='https://${tenant.outputUrl}' target="_blank">${tenant?.outputUrl}</a></td>
					</tr>
          `
					: ''
			})}
    </table>
    <p>:clock1: Build time: <b>${duration}s</b></p>
    <p>${image}</p>
  `
}
