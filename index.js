const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

try {
  exec(`git config user.name "GitHub Actions Bot" && git config user.email "action@github.com"`, (err) => {
    if (err) {
      core.error('Failed to set git user config');
      core.setFailed(error.message);
      throw err;
    }
  });

  const inputs = {
    githubToken: core.getInput("github_token", { required: true }),
    find: core.getInput("find"),
    replace: core.getInput("replace"),
  };
  const octokit = new github.GitHub(inputs.githubToken);

  const params = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
    body: github.context.payload.pull_request.body,
  };

  if (inputs.find) {
    core.info(`Replacing ${inputs.find}`);
    params.body = params.body.replace(new RegExp(inputs.find), inputs.replace);
  }

  core.setOutput('body', params.body);

  octokit.pulls.update(params);
} catch (error) {
  core.setFailed(error.message);
}
