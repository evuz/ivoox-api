const nodemon = require('nodemon')
const chokidar = require('chokidar')
const path = require('path')

const { build } = require('./esbuild')
const { Cleanup } = require('./cleanup')

const srcPath = path.join(__dirname, '..', 'src')
const outPath = path.join(__dirname, '..', 'dist')

async function main () {
  Cleanup()

  await build()
  nodemon({ script: 'dist/index.js', watch: outPath })

  chokidar.watch(srcPath).on('change', () => {
    console.clear()
    build()
  })
}

main()
