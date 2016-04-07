#!/usr/bin/env node

const minimist = require('minimist')
const build = require('./')
const debug = require('debug')('github-to-docker:cli')

var argv = minimist(process.argv, {
  boolean: ['version'],
  alias: {
    tag: 't',
    help: 'h',
    quiet: 'q',
    version: 'v'
  },
  default: {
    cache: true
  }
})

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

if (argv.help) {
  console.error(
    'Usage: github-to-docker repo [options]\n\n' +
    '  --version,     -v\n'
  )
  process.exit(1)
}

const repo = argv._[2]

if (!repo) {
  console.error('Missing repository')
  process.exit(1)
}

const opts = {
  github: {
    repo: repo,
    ref: argv.ref || 'master'
  },
  docker: { opts: {} }
}

if (argv.tag) {
  opts.docker.tag = argv.tag
}

debug('Building with options %j', opts)
build(opts).pipe(process.stdout)
