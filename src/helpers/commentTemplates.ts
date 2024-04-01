import {
	IDeployInProgressPrams,
	IdeployFinalized,
	ICommentTenantDeployURL,
} from './types'

const commentTenantDeployURL = ({ tenantsList }: ICommentTenantDeployURL) => {
	return tenantsList
		.map((tenant) => {
			return tenant.token
				? `
					<tr>
						<td><strong>✅ ${tenant.tenantName}</strong></td>
						<td><a href='https://${tenant.outputUrl}' target="_blank">${tenant?.outputUrl}</a></td>
						<td>${tenant.statusCode}</td>
					</tr>
					`
				: ''
		})
		.join('')
}

export const deployInProgressTemplate = ({
	gitCommitSha,
	buildingLogUrl,
	deployingImage,
	tenantsList,
}: IDeployInProgressPrams) => {
	return `
		${tenantsList
			.map((tenant) => {
				return `
					<p>
						⚡️ Deploying PR Preview ${gitCommitSha} to: <a href="https://${tenant.outputUrl}">${tenant.tenantName}</a> ... <a href="${buildingLogUrl}">Build logs</a>
					</p>
				`
			})
			.join('')}
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
      <thead>
        <tr>
	        <th>Tenant</th>
	        <th>URL</th>
	        <th>Deploy status</th>
        </tr>
      </thead>
			${commentTenantDeployURL({ tenantsList })}
    </table>
    <p>:clock1: Build time: <b>${duration}s</b></p>
    <p>${image}</p>
  `
}
