A tool to help you pack your NPM package to a zip file that includes all of the dependencies of the package and ready to deploy to AWS-lambda/Azure Web Apps by default.

## Usage
Script
```js
const pack = require('npm-pack-all-zip');
const devDeps = false; // not includes devDependencies
const name = 'name-from-package-json';
const dist = './'; // the path relative to the the project

pack(name, devDeps, dist).then(function () {
....  
});
```
Cli
```
npm-pack-all-zip --name=your-zip-file-name --dist=xxx/xxx --dev-deps
```

Note: All args are optional. Please check script secion for detail.
