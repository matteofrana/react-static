const path = require('path')
const { escapeRegExp } = require('./')

let ignorePath

// Allow as much stack tracing as possible
Error.stackTraceLimit = Infinity

require('@babel/register')({
  ignore: [
    function babelIgnore(filename) {
      // true if should ignore
      return (
        new RegExp(escapeRegExp(`${path.sep}node_modules${path.sep}`)).test(
          filename
        ) ||
        (ignorePath && ignorePath.test(filename))
      )
    },
  ],
})

const PrettyError = require('pretty-error')

// necesarry at any entry point of the cli to ensure that Babel-register
// does not attempt to transform non JavaScript files.
const ignoredExtensions = [
  'css',
  'scss',
  'styl',
  'less',
  'png',
  'gif',
  'jpg',
  'jpeg',
  'svg',
  'woff',
  'woff2',
  'ttf',
  'eot',
  'otf',
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'md',
  'yaml',
]
ignoredExtensions.forEach(ext => {
  require.extensions[`.${ext}`] = () => {}
})

console.error = (err, ...rest) =>
  console.log(new PrettyError().render(err), ...rest)

// Be sure to log useful information about unhandled exceptions. This should seriously
// be a default: https://github.com/nodejs/node/issues/9523#issuecomment-259303079
process.on('unhandledRejection', r => {
  console.error(r)
})

module.exports = {
  setIgnorePath(path) {
    ignorePath = path ? new RegExp(escapeRegExp(path)) : undefined
  },
}
