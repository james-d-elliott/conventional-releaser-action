const core = require('@actions/core');

const release = require('conventional-github-releaser');

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(`Starting Conventional GitHub Release Action.`);

    const token = core.getInput('token');

    core.info(`Received GitHub Token.`);

    if (token === undefined) {
      core.setFailed(`The GitHub Token could not be detected (from the token action input).`);

      return;
    }

    const tokenLength = token.length;

    if (tokenLength < 40) {
      core.setFailed(`The supplied GitHub Token (from the token action input) had a length of ${tokenLength} but it should be at least have a length of 40.`);

      return;
    }

    const auth = {
      url: 'https://api.github.com/',
      type: "oauth",
      token: token
    };

    const changelogOpts = {
      preset: "angular"
    };

    const repository = process.env.GITHUB_REPOSITORY;

    core.info(`Repository detected as ${repository}.`);

    const i = repository.indexOf("/");
    const context = {
      owner: repository.substring(0, i),
      repository: repository.substring(i + 1)
    }

    core.info(`Context is ${context}.`)

    core.info(`Attempting Conventional GitHub Release.`);

    release(auth, changelogOpts, context, function(err, responses) {
      if (err !== null) {
        core.setFailed(`An error occurred creating the release: ${err}`);

        return;
      }

      core.info(`"Successfully Created the GitHub Release`);

      for (const response of responses) {
        core.debug(`Response: ${response}`);
      }
    });
  } catch (error) {
    core.setFailed(`An exception occurred calling the release module: ${error.message}`);
  }
}

run();
