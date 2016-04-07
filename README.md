# github-to-docker

Stream tarballs directly from GitHub to docker without touching the file system.

```
$ npm i github-to-docker -S
```

[![build status](http://img.shields.io/travis/ralphtheninja/github-to-docker.svg?style=flat)](http://travis-ci.org/ralphtheninja/github-to-docker)

## Usage

Build latest master branch of `ipfs/go-ipfs` with default `tag` set to `'ipfs/go-ipfs:master'` and send docker build output to `stdout`.

```js
// ipfs.js
require('github-to-docker')('ipfs/go-ipfs').pipe(process.stdout)
```

```
$ node ipfs.js
```

## CLI

```
$ npm i github-to-docker -g
$ github-to-docker ipfs/go-ipfs
Step 1 : FROM alpine:3.3
---> d7a513a663c1
Step 2 : MAINTAINER Lars Gierth <lgierth@ipfs.io>
---> Using cache
---> f6eaf10d37c6
```

```
$ github-to-docker --help
Usage: github-to-docker repo [options]

--ref,          git ref (default: master)
--tag           tag for the resulting docker image
--version, -v
```

## API

#### `var build = require('github-to-docker')(repo|opts)`

Returns a readable stream which is the build output from docker. Parameter can either be a string or an object. Use the string version to build an open source repo.

Options takes the following properties:

```js
{
  github: {}, // used by 'github-archive-stream'
  docker: {}  // used by 'docker-build'
}
```

For private repositories you need to provide authentication, see [`github-archive-stream`](https://github.com/ralphtheninja/github-archive-stream).

For default docker values, see [`docker-build`](https://github.com/mafintosh/docker-build#api).

If `opts.docker.tag` is not set, it will default to `repo:ref`.

## License

MIT
