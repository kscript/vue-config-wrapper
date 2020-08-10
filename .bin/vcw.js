#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const wrapper = require('../src')
const pkg = require('../package.json')
const { exec } = require('child_process');
const cwd = function(filePath) {
  return path.join(process.cwd(), filePath)
}
const getConfig = function (filePath) {
  try {
    return require(cwd(filePath))
  } catch (err) {
    throw err
  }
}
const program = require('commander')

program
  .version(pkg.version, '-v, --version')
  .usage('[options]')
  .option('-c, --config <file path>', 'Vue configuration file')
  .option('-o, --output <file path>', 'Output a file in JSON format')
  .parse(process.argv)

function resolve(program) {
  const { config, output, args } = program
  if (!config && !output && args.length) {
    console.log('Please input the correct command, or use `vcw --help` for help')
    return
  }
  const cj = getConfig(config || 'vue.config.js')
  let result = {}
  if (typeof cj === 'function') {
    console.log('The currently imported configuration is a function, try to call to get the return value')
    result = wrapper(cj())
  } else if (cj instanceof Object) {
    result = wrapper(cj)
  }

  if (!(result instanceof Object)) {
    console.log('There are some errors in the configuration file')
    return
  }
  // console.log('Update version of vue-config-wrapper')
  exec('npm i -g vue-config-wrapper@latest', function (err, stdout, stderr) {
    if (output) {
      try {
        fs.writeFileSync(cwd(output), JSON.stringify(result, null, 2))
      } catch (err) {
        throw err
      }
    } else {
      console.log(JSON.stringify(result, null, 2))
    }
  })
}

resolve(program)