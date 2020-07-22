import * as Args_client from "./clients/args";
import * as Cli_client from "./clients/cli";
import logger from "./clients/logger";

const main = () => {
  try {
    Args_client.from_args(process.argv.slice(2))
      .then(Cli_client.client)
      .catch((e) => console.error(e));
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

main();
