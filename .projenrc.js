const { TypeScriptAppProject, NpmAccess } = require('projen');

const project = new TypeScriptAppProject({
  name: '@sv-oss/changelog-autotagger',
  description: 'Automatically tags JIRA tickets generated through a changelog with the relevant release number',
  repositoryUrl: 'https://github.com/sv-oss/changelog-autotagger',
  authorName: 'Service Victoria',
  authorEmail: 'platform@service.vic.gov.au',
  license: 'MIT',
  package: true,
  release: true,
  releaseToNpm: true,
  npmAccess: NpmAccess.PUBLIC,
  defaultReleaseBranch: 'master',
  jest: true,
  deps: [
    'cmd-ts',
    'jira-client',
    'chalk',
    'dotenv',
  ],
  devDeps: [
    '@types/jira-client',
  ],
  gitignore: ['.env'],
  homepage: 'https://github.com/sv-oss/changelog-autotagger',
});

// add support for dom library in typescript compiler
addTsOverride('compilerOptions.lib', ['es2018', 'dom']);
addTsOverride('compilerOptions.esModuleInterop', true);
addTsOverride('compilerOptions.useUnknownInCatchVariables', false);

project.synth();

/**
 * addTsOverride - Adds an override to all tsconfig files (base, eslint & test)
 * @param {string} path - The path to override
 * @param {*} value - The new overridden value
 */
function addTsOverride(path, value) {
  project.tsconfig.file.addOverride(path, value);
  project.tsconfigEslint.file.addOverride(path, value);
  project.tryFindObjectFile('tsconfig.jest.json').addOverride(path, value);
}