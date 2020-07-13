import logger from "./logger";
import commander, { CommanderStatic } from "commander";
import { backup_client } from "./backup_client";
import { init_console } from "./init_console";

export type cli_arguments = {
  cosmosdbAccountEndpoint?: string;
  cosmosdbAccountKey?: string;
  storageAccountName?: string;
  storageAccountContainer?: string;
  storageAccountKey?: string;
  filesystemPath?: string;
  banner?: boolean;
};

export function cli_client(args: string[]): CommanderStatic {
  try {
    init_console(args);

    const cli = commander.description("CosmosDB CLI Client");

    cli.option("--no-banner", "Remove banner from CLI output");

    // cosmosdb-cli backup
    cli
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
      .option("filesystem", "Backup to file system")
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

    cli.parse(args);

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
