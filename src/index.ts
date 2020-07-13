import { cli_client } from "./modules/cli_client";

async function main() {
  cli_client(process.argv);
}

main().catch((error) => {
  console.error(error);
});
