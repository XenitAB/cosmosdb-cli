import * as Cli_client from "./modules/cli_client";

async function main() {
  Cli_client.client(process.argv);
}

main().catch((error) => {
  console.error(error);
});
