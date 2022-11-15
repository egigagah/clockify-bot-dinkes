import chalk from "chalk";

const logger = (msg) => console.log(msg);

logger.white = (msg) => `${chalk.white(msg)}`
logger.whiteBold = (msg) => `${chalk.white.bold(msg)}`
logger.green = (msg) => `${chalk.greenBright(msg)}`
logger.greenBold = (msg) => `${chalk.greenBright.bold(msg)}`
logger.red = (msg) => `${chalk.redBright(msg)}`
logger.redBold = (msg) => `${chalk.redBright.bold(msg)}`
logger.yellow = (msg) => `${chalk.yellowBright(msg)}`
logger.yellowBold = (msg) => `${chalk.yellowBright.bold(msg)}`

export default logger;
