import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import logger from "./logger";
import { config, get_config_boolean } from "./config";
import { cli_arguments } from "./cli_client";

export function init_console(args: string[]): void {
  try {
    const show_banner = args.slice(2).includes("--no-banner") ? false : true;
    if (get_config_boolean(config.banner, { banner: show_banner })) {
      clear();
      console.log(
        chalk.red(figlet.textSync("cosmosdb-cli", { horizontalLayout: "full" }))
      );
    }
  } catch (e) {
    logger.error({
      function: "init_console",
      error: e,
    });
    process.exit(1);
  }
}
