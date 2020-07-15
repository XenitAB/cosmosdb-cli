import logger from "./logger";
import commander, { CommanderStatic } from "commander"; // Question: Should these be imported using import * as Commander from "commander"; ?
import * as Backup_client from "./backup_client";
import * as Config from "./config";

type cosmosdb = {
  cosmosdbAccountEndpoint?: Config.cosmosdb["cosmosdb_account_endpoint"];
  cosmosdbAccountKey?: Config.cosmosdb["cosmosdb_account_key"];
};

type azure_storage_account = {
  type: "azure-storage-account";
  storageAccountName?: Config.azure_storage_account["storage_account_name"];
  storageAccountContainer?: Config.azure_storage_account["storage_account_container"];
  storageAccountKey?: Config.azure_storage_account["storage_account_key"];
} & cosmosdb;

type filesystem = {
  type: "filesystem";
  filesystemPath?: Config.filesystem["filesystem_path"];
} & cosmosdb;

type t = azure_storage_account | filesystem;

const to_config = (args: t): Config.t => {
  try {
    const cosmosdb = {
      cosmosdb_account_endpoint: args.cosmosdbAccountEndpoint,
      cosmosdb_account_key: args.cosmosdbAccountKey,
    };

    switch (args.type) {
      case "azure-storage-account":
        const azure_storage_account = {
          storage_account_name: args.storageAccountName,
          storage_account_container: args.storageAccountContainer,
          storage_account_key: args.storageAccountKey,
        };
        return Config.from_partial({
          ...cosmosdb,
          ...azure_storage_account,
          type: args.type,
        });
      case "filesystem":
        const filesystem_path = args.filesystemPath;
        return Config.from_partial({
          ...cosmosdb,
          filesystem_path,
          type: args.type,
        });
      default:
        logger.error({
          function: "Cli_client.to_config",
          error: "No known type defined.",
        });
        process.exit(1);
    }
  } catch (e) {
    logger.error({
      function: "Cli_client.to_config",
      error: e,
    });
    process.exit(1);
  }
};

export const client = (args: string[]): CommanderStatic => {
  try {
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
      .action(function (
        location: "azure-storage-account" | "filesystem",
        cmd_obj: t
      ) {
        Backup_client.client(to_config({ ...cmd_obj, type: location }));
      });

    cli.parse(args);

    if (!args.slice(2).length) commander.outputHelp();

    return cli;
  } catch (e) {
    logger.error({
      function: "Cli_client.client",
      error: e,
    });
    process.exit(1);
  }
};
