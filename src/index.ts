import * as Args_model from "./models/args";
import * as Commands_model from "./models/commands";
import * as Cli_client from "./clients/cli";
import logger from "./clients/logger";

Args_model.from_args(process.argv.slice(2))
  .then(Commands_model.from_args)
  .then(Cli_client.client)
  .catch((e) => {
    logger.error(e);
    throw new Error(e);
  });
