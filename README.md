# Changelog Autotagger

changelog-autotagger is a CLI for extracting tickets out of a changelog generated by [standard-version](https://github.com/conventional-changelog/standard-version), and adding a tag to those tickets in JIRA.

Two options are required for changelog-autotagger to function, first being a relative path to the changelog file. Second being the version that you want to tag the release as.

**Note** - all tickets in the changelog supplied will be tagged. If you supply the running changelog, it will try to re-tag every issue each execution. It is recommended that you extract just the latest release details and supply it as the source file.

### Usage

There are 2 key ways to use changelog-autotagger. First is through npx as below:

```bash
npx @sv-oss/changelog-autotagger ./my-release-notes.txt --release-version=1.2.3
```

Second is to add it as a global dependency and invoke it directly

```bash
yarn global add @sv-oss/changelog-autotagger
// or
npm i -g @sv-oss/changelog-autotagger
changelog-autotagger ./my-release-notes.txt --release-version=1.2.3
```

### Authentication

Out of the box, the JIRA client uses https authentication. To connect to your JIRA instance, you need to export the below environment variables:

```
export JIRA_ADAPTER_HOST=YOUR_JIRA_INSTANCE.atlassian.net
export JIRA_ADAPTER_USERNAME=YOUR_USERNAME
export JIRA_ADAPTER_PASSWORD=YOUR_PASSWORD_TOKEN
```

JIRA has disabled API access via direct password. See [Manage API tokens for your Atlassian account](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/) for more details and instructions for setting up a token.

### Options

| Param name | Description | Usage | Expected |
| --- | --- | --- | --- |
| `--prefix` | A prefix supplied before each version when creating it in each project | --prefix=hi | fixVersion=hi-1.0.0 |
| `--adapter-path` | Allows user to supply a custom adapter - *see details below* | --adapter-path=./my-adapter.js |Custom adapter used |

## Custom adapters

A custom adapter may be used if you're using something other than JIRA to manage tickets, or if you're wanting to authenticate JIRA via a method other than https.

Pull requests are welcome for any additional adapter types, for common ones they will be reviewed and accepted.

An adapter is required to implement the following methods:

```
    export default {
        verifyIssueExists: (issueId: string) => Promise<boolean>;

        createVersion: (projectId: ReturnType<getProjectId>, name: string, releaseDate: string, options: any) => Promise<void>;

        getProjectId: (projectName: string) => Promise<any>;

        tagFixVersion: (ticketId: string, fixVersion: string) => Promise<void>;
    }
```