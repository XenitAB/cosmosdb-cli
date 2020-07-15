import logger from "./logger";

export type cosmosdb = {
  cosmosdb_account_endpoint: string;
  cosmosdb_account_key: string;
};

export type azure_storage_account = {
  type: "azure-storage-account";
  storage_account_name: string;
  storage_account_container: string;
  storage_account_key: string;
} & cosmosdb;

export type filesystem = {
  type: "filesystem";
  filesystem_path: string;
} & cosmosdb;

export type t = azure_storage_account | filesystem;

const default_cosmosdb: Partial<cosmosdb> = {
  cosmosdb_account_endpoint: process.env.COSMOSDB_CLI_COSMOSDB_ACCOUNT_ENDPOINT,
  cosmosdb_account_key: process.env.COSMOSDB_CLI_COSMOSDB_ACCOUNT_KEY,
};

const default_azure_storage_account: Partial<azure_storage_account> = {
  storage_account_name: process.env.COSMOSDB_CLI_STORAGE_ACCOUNT_NAME,
  storage_account_container: process.env.COSMOSDB_CLI_STORAGE_ACCOUNT_CONTAINER,
  storage_account_key: process.env.COSMOSDB_CLI_STORAGE_ACCOUNT_KEY,
};

const default_filesystem: Partial<filesystem> = {
  filesystem_path: process.env.COSMOSDB_CLI_FILESYSTEM_PATH,
};

function is_valid(partial_config: Partial<t> | t): partial_config is t {
  try {
    if (
      partial_config.cosmosdb_account_endpoint == null ||
      partial_config.cosmosdb_account_key == null
    ) {
      return false;
    }

    if (
      partial_config.type === "azure-storage-account" &&
      partial_config.storage_account_name != null &&
      partial_config.storage_account_container != null &&
      partial_config.storage_account_key != null
    ) {
      return true;
    } else if (
      partial_config.type === "filesystem" &&
      partial_config.filesystem_path != null
    ) {
      return true;
    }

    return false;
  } catch (e) {
    logger.error({
      function: "Config.is_valid",
      error: e,
    });
    process.exit(1);
  }
}

function valid_or_exit(config: Partial<t>): t {
  try {
    if (is_valid(config)) {
      return config;
    } else {
      logger.error({
        function: "Config.valid_or_exit",
        error: "Config not valid.",
        config: config,
      });
      process.exit(1);
    }
  } catch (e) {
    logger.error({
      function: "Config.valid_or_exit",
      error: e,
    });
    process.exit(1);
  }
}

// Question: Am I cheating with types here?
function filter_undefined(partial_config: Partial<t>): Partial<t> {
  try {
    const filtered_partial_config = Object.entries(partial_config)
      .filter((entry) => entry[1] !== undefined)
      .reduce((object, entry) => {
        return { ...object, [entry[0]]: entry[1] };
      }, {});
    return filtered_partial_config as Partial<t>;
  } catch (e) {
    logger.error({
      function: "Config.filter_undefined",
      error: e,
    });
    process.exit(1);
  }
}

export function from_partial(partial_config: Partial<t>): t {
  try {
    const filtered_partial_config = filter_undefined(partial_config);
    if (is_valid(filtered_partial_config)) {
      return filtered_partial_config;
    }

    switch (filtered_partial_config.type) {
      case "azure-storage-account":
        return valid_or_exit({
          ...default_cosmosdb,
          ...default_azure_storage_account,
          ...filtered_partial_config,
        });
      case "filesystem":
        return valid_or_exit({
          ...default_cosmosdb,
          ...default_filesystem,
          ...filtered_partial_config,
        });
      default:
        return valid_or_exit(filtered_partial_config);
    }
  } catch (e) {
    logger.error({
      function: "Config.from_partial",
      error: e,
    });
    process.exit(1);
  }
}
