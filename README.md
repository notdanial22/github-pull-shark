# GitHub Pull Shark Achievement Generator

[![npm version](https://img.shields.io/npm/v/github-pull-shark.svg)](https://www.npmjs.com/package/github-pull-shark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically create and merge pull requests to earn the GitHub Pull Shark achievement on your profile. The Pull Shark achievement is awarded to users who have had multiple pull requests merged.

![GitHub Pull Shark Achievement](https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png)

## Installation

```bash
# Install globally
npm install -g github-pull-shark

# Or install locally in your project
npm install github-pull-shark
```

## Requirements

1. A GitHub Personal Access Token (PAT)
2. A GitHub repository that you own (or have write access to)

## Getting a GitHub Personal Access Token

1. Visit [GitHub's token settings](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give it a descriptive name (e.g., "Pull Shark Generator")
4. Select the following permissions:
   - `repo` (Full control of private repositories)
   - Or at minimum: `public_repo` (if only using with public repositories)
5. Click "Generate token"
6. **Important**: Copy your token immediately as you won't be able to see it again!

## Usage

### Command Line Interface (CLI)

You can run the tool directly from the command line:

```bash
# Run with interactive prompts
github-pull-shark

# Or provide all options as arguments
github-pull-shark --token YOUR_GITHUB_TOKEN --username YOUR_USERNAME --repo YOUR_REPO --number 4
```

#### CLI Options

- `-t, --token <token>` - Your GitHub personal access token
- `-u, --username <username>` - Your GitHub username
- `-r, --repo <repository>` - Target repository name
- `-n, --number <number>` - Number of pull requests to create (default: 1)
- `--non-interactive` - Run without interactive prompts
- `-V, --version` - Output the version number
- `-h, --help` - Display help information

### Environment Variables

You can also set the following environment variables:

```
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_username
TARGET_REPO=your_repository
```

Create a `.env` file in your project directory with these variables.

### Programmatic Usage

You can also use the package programmatically in your JavaScript code:

```javascript
const PullShark = require('github-pull-shark')

const config = {
  token: 'YOUR_GITHUB_TOKEN',
  owner: 'YOUR_USERNAME',
  repo: 'YOUR_REPOSITORY',
  numPullRequests: 4, // Number of PRs to create
}

const pullShark = new PullShark(config)
pullShark.validate()
pullShark
  .run()
  .then(() => console.log('Done!'))
  .catch((error) => console.error(`Error: ${error.message}`))
```

## Best Practices

- Create a dedicated repository for this tool to avoid cluttering your main repos
- GitHub may have rate limits or abuse detection, so don't create too many PRs at once
- The Pull Shark achievement typically requires at least 2 merged pull requests, but creating 4 is recommended to ensure you receive it

## Troubleshooting

### Token Permissions

If you're getting authentication errors, make sure your token has the correct permissions as listed above.

### Repository Access

Make sure you're using a repository that you own or have write access to.

### Rate Limiting

If you hit GitHub's rate limits, try creating fewer PRs or wait a while before trying again.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created with ❤️ by [Muhammad Danial](https://github.com/notdanial22)

---

If you found this package helpful, please consider ⭐ starring our [GitHub repository](https://github.com/notdanial22/github-pull-shark)!
