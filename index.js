const core = require('@actions/core');

const release = require('conventional-github-releaser');

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(`Starting Conventional GitHub Release.`);

    const token = core.getInput('token');

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
      type: "oauth",
      token: token
    };

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
