const fs = require('fs');
const path = require('path');
const packlist = require('npm-packlist');
const archiver = require('archiver-promise');

async function pack (source, destination, name) {
  if (!fs.existsSync(destination)) fs.mkdirSync(destination);

  const files = await packlist({ path: source });
  const archive = archiver(path.join(destination, `${name}.zip`));

  files.forEach(function (file) {
    archive.file(path.join(source, file), { name: file });
  });

  return archive.finalize();
}

module.exports = function (name, devDeps, destination) {
  const ROOT_DIR = process.cwd();
  const FILES_TO_BACKUP = ['package.json', 'package-lock.json', 'yarn.lock', '.npmignore'];
  const TEMP_DIR = path.join(ROOT_DIR, '.npm-zip-tmp');
  const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
  const packageJson = require(PACKAGE_JSON_PATH);

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

  console.info('Backing up files...');
  FILES_TO_BACKUP.forEach(function (file) {
    const sourceFile = path.join(ROOT_DIR, file);
    if (!fs.existsSync(sourceFile)) return;

    fs.copyFileSync(sourceFile, path.join(TEMP_DIR, file));
  });

  console.info('Backup completed');

  packageJson.bundledDependencies = Object.keys(packageJson.dependencies);
  if (devDeps) {
    packageJson.bundledDependencies.concat(Object.keys(packageJson.devDependencies));
  }

  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 4));

  // pack with npm
  console.info(`Packing dependencies: ${packageJson.bundledDependencies.join(', ')}`);

  name = name || packageJson.name;
  destination = destination ? path.join(ROOT_DIR, destination) : ROOT_DIR;

  return pack(ROOT_DIR, destination, name).then(function () {
    console.info('Finished packing');
    console.info('Restoring backup files...');
    FILES_TO_BACKUP.forEach(function (file) {
      const sourceFile = path.join(TEMP_DIR, file);
      if (!fs.existsSync(sourceFile)) return;
      fs.renameSync(sourceFile, path.join(ROOT_DIR, file));
    });
    fs.rmdirSync(TEMP_DIR);
    console.info('Restored');
  });
};
