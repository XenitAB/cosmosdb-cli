import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import logger from "./logger";

export function InitConsole(): void {
  try {
    clear();
    console.log(
      chalk.red(figlet.textSync("cosmosdb-cli", { horizontalLayout: "full" }))
    );
  } catch (e) {
    logger.error({
      function: "InitConsole",
      error: e,
    });
    process.exit(1);
  }
}
