const fs = require("fs");
const exec = require("child_process").exec;
const ignore = "./script-release/.ignore";
let child;

/**
 *
 * @returns {Promise<any>}
 */
 function editGitIgnore() {
    return new Promise(function(resolve, reject) {
        fs.readFile('./script-release/.ignore', "utf8", function(err, data) {
            if (err) {
                return
            }
            fs.writeFile("./.gitignore", data , function(err) {
                if (err) {
                    reject(console.log(err));
                    return
                }
                resolve(console.log("gitignore was saved!"));
            });
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
                return
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
                    return
                }
                let branchName = "Release-" + version.version + "-Build-" + version.build;
                let PromisePackageJson = new Promise(function(resolve) {
                    fs.readFile("./package.json", "utf8", function(err, data) {
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
                    fs.writeFile("./package.json", JSON.stringify(result, null, 2), function(err) {
                        if (err) {
                            console.log(err);
                            return
                        }
                        console.log("gitignore was saved!");
                    });
                });

                child = exec(`git add --all && git commit -m "NewBuildVersion-${branchName}"`, function(
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

            child = exec("git rm -r --cached . && git add --all && git commit -m \"" + branchName + "\"",{maxBuffer: 1024 * 1024}, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log("exec error: " + error);
                    reject();
                }
                console.log("exec error: " + stderr);
                console.log("stdout: " + stdout);
                resolve();
            });
        }, 4000);
    });
}

/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpBuild = async function bumpBuild() {
    let content;
    let branchName;
    let NewBranchAfterCreation;
    let build;
    let version;
    try{
        content = await ReadVersionFile();
        build = parseInt(content.build);
        version = {
            version: content.version,
            build: ++build,
        };
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        branchName = await writeNewVersion(version);
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
        console.log("newVersionAdded");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await editGitIgnore();
        console.log("gitIgnoreUpdated");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await GitCommitRmCached(NewBranchAfterCreation);
        console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
        console.log("Done...");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
};
/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpVersionBreaking = async function bumpVersionBreaking() {
    let content;
    let branchName;
    let NewBranchAfterCreation;
    let build;
    let versionbump;
    let version;
    try{
        content = await ReadVersionFile();
        build = parseInt(content.build);
        versionbump = content.version.split(".");
        versionbump = [++versionbump[0],versionbump[1] = 0,versionbump[2] = 0];
        versionbump = versionbump.join(".");
        version = {
            version: versionbump,
            build: ++build,
        };
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }

    try{
        branchName = await writeNewVersion(version);
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
        console.log("newVersionAdded");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await editGitIgnore();
        console.log("gitIgnoreUpdated");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await GitCommitRmCached(NewBranchAfterCreation);
        console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
        console.log("Done...");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
};
/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpVersionFeature = async function bumpVersionFeature() {
    let content;
    let branchName;
    let NewBranchAfterCreation;
    let build;
    let versionbump;
    let version;
    try{
        content = await ReadVersionFile();
        build = parseInt(content.build);
        versionbump = content.version.split(".");
        versionbump = [versionbump[0],++versionbump[1],versionbump[2] = 0];
        versionbump = versionbump.join(".");
        version = {
            version: versionbump,
            build: ++build,
        };
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }

    try{
        branchName = await writeNewVersion(version);
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
        console.log("newVersionAdded");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await editGitIgnore();
        console.log("gitIgnoreUpdated");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await GitCommitRmCached(NewBranchAfterCreation);
        console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
        console.log("Done...");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
};
/**
 *
 * @returns {Promise<void>}
 */
module.exports.bumpVersionBugfix = async function bumpVersionBugfix() {
    let content;
    let branchName;
    let NewBranchAfterCreation;
    let build;
    let versionbump;
    let version;
    try{
        content = await ReadVersionFile();
        build = parseInt(content.build);
        versionbump = content.version.split(".");
        versionbump = [versionbump[0],versionbump[1],++versionbump[2]];
        versionbump = versionbump.join(".");
        version = {
            version: versionbump,
            build: ++build,
        };
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }

    try{
        branchName = await writeNewVersion(version);
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        NewBranchAfterCreation = await checkoutToNeWBranch(branchName);
        console.log("newVersionAdded");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await editGitIgnore();
        console.log("gitIgnoreUpdated");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
    try{
        await GitCommitRmCached(NewBranchAfterCreation);
        console.log("cache removed and commit created by name of :" + NewBranchAfterCreation);
        console.log("Done...");
    } catch (e) {
        console.log('error happened: ' + e);
        throw e;
    }
};
