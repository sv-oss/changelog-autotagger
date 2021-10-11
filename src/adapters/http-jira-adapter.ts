import JiraApi from 'jira-client';
import JiraAdapter from './jira-adapter';

export default new JiraAdapter(
  new JiraApi({
    protocol: 'https',
    host: process.env.JIRA_ADAPTER_HOST || '',
    username: process.env.JIRA_ADAPTER_USERNAME,
    password: process.env.JIRA_ADAPTER_PASSWORD,
    strictSSL: !process.env.JIRA_ADAPTER_DISABLE_STRICT_SSL,
    apiVersion: '2',
  }),
);
