const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const warning = chalk.keyword('orange');

const exists = fs.existsSync || path.existsSync;

function getGitFolderPath(currentPath) {
  var git = path.resolve(currentPath, '.git');
  if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
    var newPath = path.resolve(currentPath, '..');
    // Stop if we on top folder
    if (currentPath === newPath) return null;
    return getGitFolderPath(newPath);
  }
  return git;
}

const git = getGitFolderPath(__dirname);

console.log();
if (!git) {
  console.log(
    `Not found any ${chalk.bold.underline(
      '.git'
    )} folder for installing 996 pre-commit hook.`
  );
  console.log(chalk.bold.red('Failed to install!!'));
  return;
}

console.log(`Finded ${chalk.bold.underline('.git')} folder to install:`);
console.log('  ', chalk.green(git));
console.log();

const hooks = path.resolve(git, 'hooks');
const precommit = path.resolve(hooks, 'pre-commit');

if (!exists(hooks)) fs.mkdirSync(hooks);

// If there's an existing `pre-commit` hook we want to back it up
if (exists(precommit) && !fs.lstatSync(precommit).isSymbolicLink()) {
  console.log(warning('Detected an existing git pre-commit hook'));
  fs.writeFileSync(precommit + '.old', fs.readFileSync(precommit));
  console.log(warning('Old pre-commit hook backuped to `pre-commit.old`'));
}

// We cannot create a symlink over an existing file so make sure it's gone and
// finish the installation process.
//
try {
  fs.unlinkSync(precommit);
} catch (e) {}

// TODO: we donot keep launching the old pre-commit scripts
// let hookRelativeUnixPath = hook.replace(__dirname, '.');
// console.log(hookRelativeUnixPath);

console.log('TODO:');
