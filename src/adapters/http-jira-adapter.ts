import JiraApi from 'jira-client';
import JiraAdapter from './jira-adapter';

const requiredKeys = [
  'JIRA_ADAPTER_HOST',
  'JIRA_ADAPTER_USERNAME',
  'JIRA_ADAPTER_PASSWORD',
];

const missedKeys = requiredKeys.filter(key => !process.env[key]);

if (missedKeys) {
  throw new Error(`Missing required key for jira-http-adapter: ${missedKeys}`);
}

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
