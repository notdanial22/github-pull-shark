#!/usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const PullShark = require('./index')
const packageJson = require('../package.json')

require('dotenv').config()

program
  .name('github-pull-shark')
  .description(
    'Create and merge pull requests to earn the GitHub Pull Shark achievement'
  )
  .version(packageJson.version)
  .option('-t, --token <token>', 'GitHub personal access token')
  .option('-u, --username <username>', 'GitHub username')
  .option('-r, --repo <repository>', 'Target repository name')
  .option('-n, --number <number>', 'Number of pull requests to create', '1')
  .option('--non-interactive', 'Run without interactive prompts')
  .parse(process.argv)

const options = program.opts()

async function run() {
  let config = {
    token: options.token || process.env.GITHUB_TOKEN,
    owner: options.username || process.env.GITHUB_USERNAME,
    repo: options.repo || process.env.TARGET_REPO,
    numPullRequests: options.number ? parseInt(options.number, 10) : undefined,
  }

  if (!options.nonInteractive) {
    const questions = []

    if (!config.token) {
      questions.push({
        type: 'password',
        name: 'token',
        message: 'Enter your GitHub personal access token:',
        validate: (input) => (input.length > 0 ? true : 'Token is required'),
      })
    }

    if (!config.owner) {
      questions.push({
        type: 'input',
        name: 'owner',
        message: 'Enter your GitHub username:',
        validate: (input) => (input.length > 0 ? true : 'Username is required'),
      })
    }

    if (!config.repo) {
      questions.push({
        type: 'input',
        name: 'repo',
        message: 'Enter the target repository name:',
        validate: (input) =>
          input.length > 0 ? true : 'Repository name is required',
      })
    }

    if (!config.numPullRequests) {
      questions.push({
        type: 'number',
        name: 'numPullRequests',
        message: 'Enter the number of pull requests to create:',
        default: 1,
        validate: (input) =>
          input > 0 ? true : 'Number must be greater than 0',
      })
    }

    if (questions.length > 0) {
      const answers = await inquirer.prompt(questions)
      config = { ...config, ...answers }
    }
  }

  try {
    const pullShark = new PullShark(config)
    pullShark.validate()
    await pullShark.run()
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`)
    process.exit(1)
  }
}

run()
