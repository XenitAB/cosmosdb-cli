import { InitConsole } from "./modules/init_console";
import { CLIClient } from "./modules/cli_client";

async function main() {
  InitConsole();
  CLIClient(process.argv);
}

main().catch((error) => {
  console.error(error);
});
