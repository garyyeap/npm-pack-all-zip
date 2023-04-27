const fs = require('fs');
const path = require('path');
const packlist = require('npm-packlist');
const archiver = require('archiver-promise');
const sanitizeFilename = require('sanitize-filename');

function interpolate (str, map) {
  if (!str) return;
  return str.replace(/\${([^}]+)}/g, (_, prop) => map[prop]);
} 

async function pack (source, destination, name) {
  const filePath = path.join(destination, `${name}.zip`);

  if (!fs.existsSync(destination)) fs.mkdirSync(destination);
  if (fs.existsSync(filePath)) fs.rmSync(filePath);// archiver doesn't work if same name file exists. 

  const files = await packlist({ path: source });
  const archive = archiver(filePath);

  files.forEach(function (file) {
    archive.file(path.join(source, file), { name: file });
  });

  return archive.finalize();
}

module.exports = function (name, devDeps, destination) {
  const ROOT_DIR = process.cwd();
  const TEMP_DIR = path.join(ROOT_DIR, '.npm-zip-tmp');
  const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
  const packageJson = require(PACKAGE_JSON_PATH);

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

  console.info('Backing up `package.json`...');

  fs.copyFileSync(PACKAGE_JSON_PATH, path.join(TEMP_DIR, 'package.json'));
  console.info('Backup completed');

  packageJson.bundledDependencies = Object.keys(packageJson.dependencies);
  if (devDeps) {
    packageJson.bundledDependencies.concat(Object.keys(packageJson.devDependencies));
  }

  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 4));

  // pack with npm
  console.info(`Packing dependencies: ${packageJson.bundledDependencies.join(', ')}`);

  name = interpolate(name, { 
    name: packageJson.name,
    version: packageJson.version,
    timestamp: Date.now()
  });
  name = sanitizeFilename(name || packageJson.name);
  destination = destination ? path.join(ROOT_DIR, destination) : ROOT_DIR;

  return pack(ROOT_DIR, destination, name).then(function () {
    console.info('Finished packing');
    console.info('Restoring backed up file(s)...');
    
    const sourceFile = path.join(TEMP_DIR, 'package.json');
    
    if (fs.existsSync(sourceFile)) {
      fs.renameSync(sourceFile, PACKAGE_JSON_PATH);
    }

    fs.rmSync(TEMP_DIR, { recursive: true });
    console.info('Restored');
  });
};
