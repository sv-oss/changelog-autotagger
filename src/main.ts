import fs from 'fs';
import chalk from 'chalk';
import { RE_CLOSES_TICKET } from './constants';

type MainArgs = {
  releaseNotesPath: string;
  releaseVersion: string;
  shortRepoName?: string;
  adapterPath?: string;
}

interface IAdapter {
  verifyIssueExists: (issueId: string) => Promise<boolean>;
  createVersion: (projectId: number, name: string, releaseDate: string, options?: any) => Promise<void>;
  getProjectId: (projectName: string) => Promise<number>;
  tagFixVersion: (ticketId: string, fixVersion: string) => Promise<void>;
}

const isFn = (val?: any) => (val && typeof val === 'function');
const log = console.log;

export default async function main({
  releaseNotesPath,
  releaseVersion,
  adapterPath = './adapters/http-jira-adapter',
  shortRepoName = '',
}: MainArgs) {
  log(chalk.grey('Beginning tagging of changelog process'));

  const version = [shortRepoName, releaseVersion].filter(Boolean).join('-');

  let adapter: IAdapter;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const tmpAdapter = require(adapterPath).default;

    if (['verifyIssueExists', 'createVersion', 'getProjectId', 'tagFixVersion'].some(key => !isFn(tmpAdapter[key]))) {
      throw new Error('Required key for adapter is not a valid function');
    }
    adapter = tmpAdapter;
  } catch (e) {
    const err = e as any;

    log(chalk.red(err.message));
    process.exit(1);
  }

  const file = fs.readFileSync(releaseNotesPath, 'utf-8');


  const [, ...jiraTickets] = RE_CLOSES_TICKET.exec(file) || [];

  const errors: string[] = [];
  const validTickets: string[] = [];
  const validProjects: string[] = [];

  log(chalk.green(`  Verifying tickets exist in release notes file: ${chalk.bold`${releaseNotesPath}`}`));

  /**
   * Extract all the tickets that exist, including their projects
   */
  for (const ticket of jiraTickets) {
    const exists = await adapter.verifyIssueExists(ticket);

    if (exists) {
      validTickets.push(ticket);

      const [project] = ticket.split('-');
      if (validProjects.indexOf(project) === -1) {
        validProjects.push(project);
      }
    }
    log(chalk.grey`    - Ticket "${chalk.underline(ticket)}" - ${chalk.bold(exists ? chalk.green`Found` : chalk.red`Not Found`)}`);
  }

  log('\n');
  log(chalk.green`  Creating release version "${chalk.underline(version)}" in projects:`);
  /**
   * Create the release version in each of the relevant projects
   */
  for (const project of validProjects) {
    const id = await adapter.getProjectId(project);
    const now = new Date();
    const releaseDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    log(chalk.cyan`    - Project "${chalk.underline(project)}"`);
    await adapter.createVersion(id, version, releaseDate, {
      archived: false,
      released: true,
    });
  }
  log('\n');

  log(chalk.green`  Tagging tickets in changelog as "${version}":`);
  /**
   * Tag each of the tickets with the release version now that it has been created in the projects
   */
  for (const ticket of validTickets) {
    log(chalk.cyan`    - Ticket "${chalk.underline(ticket)}"`);
    await adapter.tagFixVersion(ticket, version);
  }

  if (errors.length) {
    errors.forEach(msg => console.error(chalk.red(msg)));
  }
}
