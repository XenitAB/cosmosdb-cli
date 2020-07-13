import logger from "./logger";

export function GetConfigString(config_obj: ConfigType, cmd_obj?: any): string {
  try {
    if (process.env[config_obj.environment_variable_name]) {
      return (
        process.env[config_obj.environment_variable_name]?.toString() || ""
      );
    } else if (cmd_obj[config_obj.commander_parameter_name]) {
      return cmd_obj[config_obj.commander_parameter_name] || "";
    } else {
      logger.error({
        function: "GetConfigString",
        message: "Configuration parameter is missing.",
        config_obj: config_obj,
        env: process.env[config_obj.environment_variable_name],
        cmd: cmd_obj[config_obj.commander_parameter_name],
      });
      process.exit(1);
    }
  } catch (e) {
    logger.error({
      function: "GetConfigString",
      error: e,
    });
    process.exit(1);
  }
}

type ConfigType = {
  environment_variable_name: string;
  commander_parameter_name: string;
};

type ConfigTypes = {
  cosmosdb_account_endpoint: ConfigType;
  cosmosdb_account_key: ConfigType;
  storage_account_name: ConfigType;
  storage_account_container: ConfigType;
  storage_account_key: ConfigType;
};

export const config: ConfigTypes = {
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
};
