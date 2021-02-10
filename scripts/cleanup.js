/**
 * https://stackoverflow.com/a/21947851
 */
function noOp () {};

exports.Cleanup = function Cleanup (callback) {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  callback = callback || noOp
  process.on('cleanup', callback)

  // do app specific cleaning before exiting
  process.on('exit', function () {
    process.emit('cleanup')
  })

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    process.exit(2)
  })

  // catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function () {
    process.exit(99)
  })
}
