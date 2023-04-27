Pack your NPM project and all its dependencies into a deploy-ready zip file for Lambda(AWS/Azure) with zero configuration required.

## Usage
### Script
```js
pack().then(function () {
....  
});
```
Options with default values:
```js
const pack = require('npm-pack-all-zip');
const devDeps = false; // no devDependencies 
const name = 'name-from-package-json'; 
// can also be a pattern: 
// '${name}-${version}-${timestamp}-abc' -> 'name-from-package-json-1.0.0-5840584058408540-abc'
const dist = './'; // the path relative to the the project root

pack(name, devDeps, dist).then(function () {
....  
});
```

### Cli
 
```
npm-pack-all-zip
```
With args. Please check the script section for the detail. 
```
npm-pack-all-zip --name='your-zip-file-name' --dist=xxx/xxx --dev-deps
```