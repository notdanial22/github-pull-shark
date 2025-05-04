const { Octokit } = require('@octokit/rest')
const { faker } = require('@faker-js/faker')

class PullShark {
  constructor(config) {
    this.token = config.token
    this.owner = config.owner
    this.repo = config.repo
    this.numPullRequests = config.numPullRequests || 1

    this.octokit = new Octokit({
      auth: this.token,
    })
  }

  async createBranch(baseBranch, newBranch) {
    try {
      const { data: refData } = await this.octokit.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${baseBranch}`,
      })

      const sha = refData.object.sha

      await this.octokit.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${newBranch}`,
        sha: sha,
      })

      console.log(`✅ Created new branch: ${newBranch}`)
      return true
    } catch (error) {
      console.error(`❌ Error creating branch: ${error.message}`)
      return false
    }
  }

  async createOrUpdateFile(branch, filePath, content, commitMessage) {
    try {
      let sha
      try {
        const { data } = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: filePath,
          ref: `heads/${branch}`,
        })
        sha = data.sha
      } catch (error) {
        // File doesn't exist, which is fine
      }

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        branch: branch,
        ...(sha && { sha }),
      })

      console.log(`✅ Created/updated file: ${filePath} on branch: ${branch}`)
      return true
    } catch (error) {
      console.error(`❌ Error creating/updating file: ${error.message}`)
      return false
    }
  }

  async createPullRequest(baseBranch, headBranch, title, body) {
    try {
      const { data } = await this.octokit.pulls.create({
        owner: this.owner,
        repo: this.repo,
        title: title,
        body: body,
        head: headBranch,
        base: baseBranch,
      })

      console.log(`✅ Created pull request #${data.number}: ${title}`)
      return data.number
    } catch (error) {
      console.error(`❌ Error creating pull request: ${error.message}`)
      return null
    }
  }

  async mergePullRequest(pullNumber) {
    try {
      await this.octokit.pulls.merge({
        owner: this.owner,
        repo: this.repo,
        pull_number: pullNumber,
        merge_method: 'merge',
      })

      console.log(`✅ Merged pull request #${pullNumber}`)
      return true
    } catch (error) {
      console.error(`❌ Error merging pull request: ${error.message}`)
      return false
    }
  }

  async run() {
    const baseBranch = 'main'

    console.log(`🦈 Starting GitHub Pull Shark Achievement Generator`)
    console.log(
      `📊 Creating ${this.numPullRequests} pull request(s) in ${this.owner}/${this.repo}\n`
    )

    for (let i = 0; i < this.numPullRequests; i++) {
      console.log(
        `\n🔄 Creating pull request ${i + 1} of ${this.numPullRequests}`
      )

      const branchName = `feature-${faker.lorem.slug()}-${Date.now()}`
      const fileName = `feature-${faker.lorem.word()}-${Date.now()}.md`
      const fileContent = `# ${faker.lorem.sentence()}\n\n${faker.lorem.paragraphs(
        3
      )}\n\nCreated at: ${new Date().toISOString()}`
      const commitMessage = `Add ${fileName} with new feature description`
      const prTitle = `Feature: ${faker.lorem.sentence()}`
      const prBody = faker.lorem.paragraphs(2)

      const branchCreated = await this.createBranch(baseBranch, branchName)
      if (!branchCreated) continue

      const fileCreated = await this.createOrUpdateFile(
        branchName,
        fileName,
        fileContent,
        commitMessage
      )
      if (!fileCreated) continue

      const prNumber = await this.createPullRequest(
        baseBranch,
        branchName,
        prTitle,
        prBody
      )
      if (!prNumber) continue

      console.log(`⏳ Waiting 5 seconds before merging...`)
      await new Promise((resolve) => setTimeout(resolve, 5000))

      await this.mergePullRequest(prNumber)

      if (i < this.numPullRequests - 1) {
        const waitTime = faker.number.int({ min: 10000, max: 30000 })
        console.log(
          `⏳ Waiting ${waitTime / 1000} seconds before next pull request...`
        )
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }

    console.log('\n✨ All pull requests created and merged!')
    console.log('🦈 Check your GitHub profile for the Pull Shark achievement!')
  }

  validate() {
    if (!this.token) {
      throw new Error('GitHub token is required')
    }
    if (!this.owner) {
      throw new Error('GitHub username is required')
    }
    if (!this.repo) {
      throw new Error('Target repository is required')
    }
    return true
  }
}

module.exports = PullShark
