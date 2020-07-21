import * as Args_client from "./clients/args";
import * as Cli_client from "./clients/cli";

const main = () => {
  try {
    Args_client.from_args(process.argv.slice(2))
      .then(Cli_client.client)
      .catch((e) => console.error(e));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

main();
