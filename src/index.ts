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
      displayName: 'release notes path',
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
    prefix: option({
      type: optional(string),
      long: 'prefix',
    }),
  },
  handler: async args => {
    await main({
      releaseNotesPath: args.releaseNotesPath,
      releaseVersion: args.rv,
      adapterPath: args.p,
      prefix: args.prefix,
    });
  },
});

run(cmd, process.argv.slice(2)).then(() => {
  console.log('Done');
}).catch((e) => {
  console.log('Done with errors');
  console.error(e.message);
});
