import logger from "./logger";
import commander, { CommanderStatic } from "commander";
import { backup_client } from "./backup_client";

export type cli_arguments = {
  cosmosdbAccountEndpoint?: string;
  cosmosdbAccountKey?: string;
  storageAccountName?: string;
  storageAccountContainer?: string;
  storageAccountKey?: string;
  filesystemPath?: string;
};

function cli_client_base(description: string): CommanderStatic {
  try {
    const cli = commander;
    cli.description(description);

    return cli;
  } catch (e) {
    logger.error({
      function: "cli_client_base",
      error: e,
    });
    process.exit(1);
  }
}

function cli_client_backup_base(): commander.Command {
  try {
    const cli = commander
      .command("backup <location>")
      .description("Backup CosmosDB to location")
      .option("")
      .option("azure-storage-account", "Backup to Azure Storage Account")
      .option(
        "--cosmosdb-account-endpoint <string>",
        "CosmosDB Account Endpoint"
      )
      .option("--cosmosdb-account-key <string>", "CosmosDB Account Key")
      .option("--storage-account-name <string>", "Storage Account Name")
      .option(
        "--storage-account-container <string>",
        "Storage Account Container"
      )
      .option("--storage-account-key <string>", "Storage Account Key")
      .option("")
      .option("file-system", "Backup to file system")
      .option("azure-storage-account", "Backup to Azure Storage Account")
      .option(
        "--cosmosdb-account-endpoint <string>",
        "CosmosDB Account Endpoint"
      )
      .option("--cosmosdb-account-key <string>", "CosmosDB Account Key")
      .option("--filesystem-path <string>", "Path to store backup")
      .action(function (location, cmdObj) {
        backup_client(location, cmdObj);
      });

    return cli;
  } catch (e) {
    logger.error({
      function: "cli_client_backup_base",
      error: e,
    });
    process.exit(1);
  }
}

export function cli_client(args: string[]): CommanderStatic {
  try {
    const cli = cli_client_base("CosmosDB CLI Client")
      .addCommand(cli_client_backup_base())
      .parse(args);
    if (!args.slice(2).length) commander.outputHelp();

    return cli;
  } catch (e) {
    logger.error({
      function: "cli_client",
      error: e,
    });
    process.exit(1);
  }
}
