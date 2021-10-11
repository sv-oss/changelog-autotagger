import { command, run, string, positional, option, optional } from 'cmd-ts';
import dotenv from 'dotenv';
import main from './main';

dotenv.config();

const cmd = command({
  name: 'changelog-autotagger',
  description: 'Automatically tags JIRA tickets generated through a changelog with the relevant release number',
  args: {
    releaseNotesPath: positional({
      type: string,
      displayName: 'releaseNotesPath',
    }),
    rv: option({
      type: string,
      long: 'release-version',
    }),
    p: option({
      type: optional(string),
      long: 'adapter-path',
      defaultValue: () => './adapters/http-jira-adapter',
    }),
    s: option({
      type: optional(string),
      long: 'short-repo-name',
    }),
  },
  handler: async args => {
    await main({
      releaseNotesPath: args.releaseNotesPath,
      releaseVersion: args.rv,
      adapterPath: args.p,
      shortRepoName: args.s,
    });
  },
});


run(cmd, process.argv.slice(2)).then(() => {
  console.log('Done');
}).catch((e) => {
  console.log('Done with errors');
  console.error(e.message);
});
