import chalk from 'chalk'

export type Logger = ReturnType<typeof createLogger>

export function createLogger (context) {
  function createText (text) {
    return `${chalk.gray(`[${context}]`)} ${text}`
  }

  function log (text) {
    console.log(chalk.cyan(createText(text)))
  }

  function error (text) {
    console.error(chalk.red(createText(text)))
  }

  function info (text) {
    console.info(chalk.yellow(createText(text)))
  }

  return { log, error, info }
}
