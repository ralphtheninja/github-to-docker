const archive = require('github-archive-stream')
const gunzip = require('gunzip-maybe')
const tar = require('tar-stream')
const build = require('docker-build')
const debug = require('debug')('github-to-docker')
const assert = require('assert')

function githubToDocker (opts) {
  if (typeof opts === 'string') {
    opts = { github: { repo: opts, ref: 'master' } }
  }

  const github = opts.github
  assert(github, '.github required')

  const docker = opts.docker || {}
  const tag = docker.tag || github.repo + ':' + github.ref
  const dockerOpts = docker.opts

  debug('github params %j', github)
  debug('docker params %s %j', tag, dockerOpts)

  const source = archive(github)
  const sink = build(tag, dockerOpts)

  const extract = tar.extract()
  const pack = tar.pack()

  extract.on('entry', function (header, stream, callback) {
    header.name = stripLeadingPath(header.name)
    stream.pipe(pack.entry(header, callback))
  })

  extract.on('finish', pack.finalize.bind(pack))

  source
    .pipe(gunzip())
    .pipe(extract)

  return pack.pipe(sink)
}

function stripLeadingPath (str) {
  return str.split('/').slice(1).join('/')
}

module.exports = githubToDocker
