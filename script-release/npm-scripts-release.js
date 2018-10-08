const fs = require("fs");
const exec = require("child_process").exec;
const ignore = require("./ignore-config");
let child;

/**
 *
 * @returns {Promise<any>}
 */
function editGitIgnore() {
  return new Promise(function(resolve, reject) {
    fs.writeFile("./.gitignore", ignore , function(err) {
      if (err) {
        reject(console.log(err));
      }
      resolve(console.log("gitignore was saved!"));
    });
  });
}

/**
 *
 * @returns {Promise<any>}
 * @constructor
 */
function ReadVersionFile() {
  return new Promise(function(resolve, reject) {
    fs.readFile("./script-release/version-build.json", "utf8", function(err, data) {
      if (err) {
        reject(console.log(err));
      }
      resolve(JSON.parse(data));
    });
  });
}

/**
 *
 * @param version
 * @returns {Promise<any>}
 */
function writeNewVersion(version) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            let contentAfterBump = JSON.stringify(version);
            fs.writeFile("./script-release/version-build.json", contentAfterBump, function(err) {
                if (err) {
                    reject(console.log(err));
                }
                let branchName = "Release-" + version.version + "-Build-" + version.build;
                let PromisePackageJson = new Promise(function(resolve) {
                    fs.readFile("../package.json", "utf8", function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let packagejson = JSON.parse(data);
                        packagejson.version = version.version;
                        console.log(packagejson);
                        resolve(packagejson);
                    });
                });
                PromisePackageJson.then(function(result) {
                    fs.writeFile("../package.json", JSON.stringify(result, null, 2), function(err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("gitignore was saved!");
                    });
                });

                child = exec('git add --all && git commit -m "NewBuildVersion-' + branchName, function(
                    error,
                    stdout,
                    stderr
                ) {
                    console.log("stdout: " + stdout);
                    console.log("stderr: " + stderr);
                });
                resolve(branchName);
            });
        }, 2000);
    });
}

/**
 *
 * @param branchName
 * @returns {Promise<any>}
 */
function checkoutToNeWBranch(branchName) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      child = exec("git checkout -b " + branchName, function(error, stdout, stderr) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        if (error) {
          reject(console.log(error));
        }
      });
      resolve(branchName);
    }, 4000);
  });
}

/**
 *
 * @param branchName
 * @returns {Promise<any>}
 * @constructor
 */
function GitCommitRmCached(branchName) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {

      child = exec("git rm -r --cached . && git add --all && git commit -m \"" + branchName + "\"", function(error, stdout, stderr) {
        if (error !== null) {
          reject(console.log("exec error: " + error));
        }
        resolve(console.log("stdout: " + stdout) +"\n\n"+ console.log("stderr: " + stderr));
      });
    }, 4000);
  });
}

/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpBuild = async function bumpBuild() {
  let content = await ReadVersionFile();
  let build = parseInt(content.build);
  let version = {
    version: content.version,
    build: ++build
  };
  let branchName = await writeNewVersion(version);
  let NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
  console.log("newVersionAdded");
  await editGitIgnore();
  console.log("gitIgnoreUpdated");
  await GitCommitRmCached(NewBranchAfterCreation);
  console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
  console.log("Done...");
};
/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpVersionBreaking = async function bumpVersionBreaking() {
  let content = await ReadVersionFile();
  let build = parseInt(content.build);
  let versionbump = content.version.split(".");
  versionbump = [++versionbump[0],versionbump[1],versionbump[2]];
  versionbump = versionbump.join(".");
  let version = {
    version: versionbump,
    build: ++build
  };
  let branchName = await writeNewVersion(version);
  let NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
  console.log("newVersionAdded");
  await editGitIgnore();
  console.log("gitIgnoreUpdated");
  await GitCommitRmCached(NewBranchAfterCreation);
  console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
  console.log("Done...");
};
/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpVersionFeature = async function bumpVersionFeature() {
  let content = await ReadVersionFile();
  let build = parseInt(content.build);
  let versionbump = content.version.split(".");
  versionbump = [versionbump[0],++versionbump[1],versionbump[2]];
  versionbump = versionbump.join(".");
  let version = {
    version: versionbump,
    build: ++build
  };
  let branchName = await writeNewVersion(version);
  let NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
  console.log("newVersionAdded");
  await editGitIgnore();
  console.log("gitIgnoreUpdated");
  await GitCommitRmCached(NewBranchAfterCreation);
  console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
  console.log("Done...");
};
/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpVersionBugfix = async function bumpVersionBugfix() {
  let content = await ReadVersionFile();
  let build = parseInt(content.build);
  let versionbump = content.version.split(".");
  versionbump = [versionbump[0],versionbump[1],++versionbump[2]];
  versionbump = versionbump.join(".");
  let version = {
    version: versionbump,
    build: ++build
  };
  let branchName = await writeNewVersion(version);
  let NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
  console.log("newVersionAdded");
  await editGitIgnore();
  console.log("gitIgnoreUpdated");
  await GitCommitRmCached(NewBranchAfterCreation);
  console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
  console.log("Done...");
};