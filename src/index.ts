import { init_console } from "./modules/init_console";
import { cli_client } from "./modules/cli_client";

async function main() {
  init_console();
  cli_client(process.argv);
}

main().catch((error) => {
  console.error(error);
});
