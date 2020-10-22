A tool to help you deploy your NPM package to AWS Lambda or Azure Web Apps which includes all of the dependencies of the package by default. Build on top of [npm-pack-zip](https://github.com/mwasplund/npm-pack-zip).

## Usage
Script
```js
const pack = require('npm-pack-all-zip');
const devDeps = true;
const name = 'your-zip-file-name';

pack(name, devDeps).then(function () {
....  
});
```
Cli
```
npm-pack-all-zip --name=your-zip-file-name --dev-deps
```

Note: The `name` arg is optional. It will use the name from `package.json` by default.
