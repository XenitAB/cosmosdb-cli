import logger from "./logger";
import { cli_arguments } from "./cli_client";

export function get_config_string(
  config_obj: config_type,
  cmd_obj?: cli_arguments
): string {
  try {
    if (process.env[config_obj.environment_variable_name]) {
      return (
        process.env[config_obj.environment_variable_name]?.toString() || ""
      );
    } else if (cmd_obj && cmd_obj[config_obj.commander_parameter_name]) {
      return cmd_obj[config_obj.commander_parameter_name] || "";
    } else {
      logger.error({
        function: "get_config_string",
        message: "Configuration parameter is missing.",
        config_obj: config_obj,
        env: process.env[config_obj.environment_variable_name],
        cmd:
          cmd_obj && cmd_obj[config_obj.commander_parameter_name]
            ? cmd_obj[config_obj.commander_parameter_name]
            : "",
      });
      process.exit(1);
    }
  } catch (e) {
    logger.error({
      function: "get_config_string",
      error: e,
    });
    process.exit(1);
  }
}

type config_type = {
  environment_variable_name: string;
  commander_parameter_name: keyof cli_arguments;
};

export type config_types = {
  cosmosdb_account_endpoint: config_type;
  cosmosdb_account_key: config_type;
  storage_account_name: config_type;
  storage_account_container: config_type;
  storage_account_key: config_type;
  filesystem_path: config_type;
};

export const config: config_types = {
  cosmosdb_account_endpoint: {
    environment_variable_name: "COSMOSDB_ACCOUNT_ENDPOINT",
    commander_parameter_name: "cosmosdbAccountEndpoint",
  },
  cosmosdb_account_key: {
    environment_variable_name: "COSMOSDB_ACCOUNT_KEY",
    commander_parameter_name: "cosmosdbAccountKey",
  },
  storage_account_name: {
    environment_variable_name: "STORAGE_ACCOUNT_NAME",
    commander_parameter_name: "storageAccountName",
  },
  storage_account_container: {
    environment_variable_name: "STORAGE_ACCOUNT_CONTAINER",
    commander_parameter_name: "storageAccountContainer",
  },
  storage_account_key: {
    environment_variable_name: "STORAGE_ACCOUNT_KEY",
    commander_parameter_name: "storageAccountKey",
  },
  filesystem_path: {
    environment_variable_name: "FILESYSTEM_PATH",
    commander_parameter_name: "filesystemPath",
  },
};
