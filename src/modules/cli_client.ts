import logger from "./logger";
import commander, { CommanderStatic } from "commander";
import { BackupClient } from "./backup_client";

function CLIClientBase(description: string): CommanderStatic {
  try {
    const cli = commander;
    cli.description(description);

    return cli;
  } catch (e) {
    logger.error({
      function: "CLIClientBase",
      error: e,
    });
    process.exit(1);
  }
}

function CLIClientBackupBase(): commander.Command {
  try {
    const cli = commander
      .command("backup <location>")
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
      .action(function (location, cmdObj) {
        BackupClient(location, cmdObj);
      });

    return cli;
  } catch (e) {
    logger.error({
      function: "CLIClientBackupBase",
      error: e,
    });
    process.exit(1);
  }
}

export function CLIClient(args: string[]): CommanderStatic {
  try {
    const cli = CLIClientBase("CosmosDB CLI Client")
      .addCommand(CLIClientBackupBase())
      .parse(args);
    if (!args.slice(2).length) commander.outputHelp();

    return cli;
  } catch (e) {
    logger.error({
      function: "CLIClient",
      error: e,
    });
    process.exit(1);
  }
}
