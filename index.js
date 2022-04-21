const core = require('@actions/core');

const release = require('conventional-github-releaser');

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(`Starting Conventional GitHub Release.`);

    const auth = {
      type: "oauth",
      token: process.env.GITHUB_TOKEN
    };

    const tokenLength = auth.token.length;

    if (tokenLength < 255) {
      core.setFailed(`The supplied GitHub Token (from the GITHUB_TOKEN environment variable) had a length of ${tokenLength} but it should be more than 255.`);

      return;
    }

    release(auth, {preset: "angular"}, function(err, responses) {
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
    core.setFailed(error.message);
  }
}

run();
