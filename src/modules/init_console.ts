import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import logger from "./logger";

export function init_console(): void {
  try {
    clear();
    console.log(
      chalk.red(figlet.textSync("cosmosdb-cli", { horizontalLayout: "full" }))
    );
  } catch (e) {
    logger.error({
      function: "init_console",
      error: e,
    });
    process.exit(1);
  }
}
