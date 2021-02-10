const esbuild = require('esbuild')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')

const pkg = require('../package.json')

exports.build = async function build () {
  const spinner = ora(chalk.cyan('Building...'))
  try {
    spinner.start()

    const starTime = Date.now()
    const result = await esbuild.build({
      entryPoints: [path.join(__dirname, '..', 'src', 'index.ts')],
      outfile: path.join(__dirname, '..', 'dist', 'index.js'),
      bundle: true,
      platform: 'node',
      target: 'node14.5',
      external: Object.keys(pkg.dependencies)
    })

    const buildTime = Date.now() - starTime
    spinner.succeed(chalk.green(`Build success in...${chalk.yellow(`${buildTime}ms`)}`))
    return result
  } catch (err) {
    spinner.fail(chalk.red('Build failed'))
    console.error(err)
    process.exit(1)
  }
}
