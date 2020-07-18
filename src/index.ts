import * as Cli_client from "./modules/Cli_client";

const main = () => {
  try {
    Cli_client.client(process.argv);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

main();
