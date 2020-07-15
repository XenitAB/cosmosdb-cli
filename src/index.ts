import * as Cli_client from "./modules/Cli_client";

const main = async () => {
  Cli_client.client(process.argv);
};

main().catch((error) => {
  console.error(error);
});
