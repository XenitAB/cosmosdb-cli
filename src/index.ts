import { init_console } from "./modules/init_console";
import { CLIClient } from "./modules/cli_client";

async function main() {
  init_console();
  CLIClient(process.argv);
}

main().catch((error) => {
  console.error(error);
});
