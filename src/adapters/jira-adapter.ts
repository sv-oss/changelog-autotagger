import chalk from 'chalk';
import JiraApi from 'jira-client';

export default class JiraAdapter {
  constructor(private api: JiraApi) {}

  public async verifyIssueExists(issueId: string) {
    try {
      await this.api.findIssue(issueId);
      return true;
    } catch (e) {
      // TODO - API down error handling - should only return false for actual 404
      chalk.red((e as any).message);
      return false;
    }
  }

  public async createVersion(
    projectId: number,
    name: string,
    releaseDate: string,
    options?: Omit<JiraApi.VersionObject, 'projectId' | 'name' | 'releaseDate'>,
  ) {
    try {
      await this.api.createVersion({
        projectId,
        name,
        releaseDate,
        ...options,
      });
    } catch (e) {
      if (e.message.includes('A version with this name already exists in this project.')) {
        console.info(chalk.grey`        A version with this name already exists in project ${projectId}`);
        return;
      }
      throw e;
    }
  }

  public async getProjectId(projectName: string) {
    const proj = await this.api.getProject(projectName);

    return parseInt(proj.id, 10);
  }

  public async tagFixVersion(ticketId: string, fixVersion: string) {
    await this.api.updateIssue(ticketId, {
      update: {
        fixVersions: [{ add: { name: fixVersion } }],
      },
    });
  }
}
