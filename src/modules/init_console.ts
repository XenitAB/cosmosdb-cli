import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export function init_console(): void {
  clear();
  console.log(
    chalk.red(figlet.textSync("cosmosdb-cli", { horizontalLayout: "full" }))
  );
}
