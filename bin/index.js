#!/usr/bin/env node
const argv = require('simple-argv');
const pack = require('../index');

pack(argv.name, argv['dev-deps']);
