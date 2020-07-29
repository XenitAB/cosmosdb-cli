import Convict, { Config, Schema } from "convict";

// types
export type cosmosdb = {
  cosmosdb_account_endpoint: string;
  cosmosdb_account_key: string;
  cosmosdb_reject_unauthorized: boolean;
};

export type azure_storage_account = {
  storage_account_name: string;
  storage_account_container: string;
  storage_account_key: string;
  storage_account_prefix: string;
  storage_account_suffix: string;
  storage_account_delimiter: string;
  storage_account_protocol: string;
  storage_account_connectionstring_suffix: string;
};

export type filesystem = {
  filesystem_path: string;
  filesystem_prefix: string;
  filesystem_suffix: string;
  filesystem_delimiter: string;
};

// schemas
const cosmosdb: Schema<cosmosdb> = {
  cosmosdb_account_endpoint: {
    doc: "CosmosDB Account Endpoint",
    format: String,
    default: null,
    arg: "cosmosdb-account-endpoint",
    env: "COSMOSDB_CLI_COSMOSDB_ACCOUNT_ENDPOINT",
  },
  cosmosdb_account_key: {
    doc: "CosmosDB Account Key",
    format: String,
    default: null,
    arg: "cosmosdb-account-key",
    env: "COSMOSDB_CLI_COSMOSDB_ACCOUNT_KEY",
    sensitive: true,
  },
  cosmosdb_reject_unauthorized: {
    doc: "CosmosDB Reject Unauthorized",
    format: Boolean,
    default: true,
    arg: "cosmosdb-reject-unauthorized",
    env: "COSMOSDB_CLI_COSMOSDB_REJECT_UNAUTHORIZED",
  },
};

const azure_storage_account: Schema<azure_storage_account> = {
  storage_account_name: {
    doc: "Azure Storage Account Name",
    format: String,
    default: null,
    arg: "storage-account-name",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_NAME",
  },
  storage_account_container: {
    doc: "Azure Storage Account Container",
    format: String,
    default: null,
    arg: "storage-account-container",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_CONTAINER",
  },
  storage_account_key: {
    doc: "Azure Storage Account Key",
    format: String,
    default: null,
    arg: "storage-account-key",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_KEY",
    sensitive: true,
  },
  storage_account_prefix: {
    doc: "Azure Storage Account prefix",
    format: String,
    default: `${Date.now().toString()}/`,
    arg: "storage-account-prefix",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_PREFIX",
  },
  storage_account_suffix: {
    doc: "Azure Storage Account suffix",
    format: String,
    default: "",
    arg: "storage-account-suffix",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_SUFFIX",
  },
  storage_account_delimiter: {
    doc: "Azure Storage Account delimiter",
    format: String,
    default: "/",
    arg: "storage-account-delimiter",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_DELIMITER",
  },
  storage_account_protocol: {
    doc: "Azure Storage Account protocol",
    format: String,
    default: "https",
    arg: "storage-account-protocol",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_PROTOCOL",
  },
  storage_account_connectionstring_suffix: {
    doc: "Azure Storage Account connection string suffix",
    format: String,
    default: "EndpointSuffix=core.windows.net;",
    arg: "storage-account-connectionstring-suffix",
    env: "COSMOSDB_CLI_STORAGE_ACCOUNT_CONNECTIONSTRING_SUFFIX",
  },
};

const filesystem: Schema<filesystem> = {
  filesystem_path: {
    doc: "Filesystem path",
    format: String,
    default: null,
    arg: "filesystem-path",
    env: "COSMOSDB_CLI_FILESYSTEM_PATH",
  },
  filesystem_prefix: {
    doc: "Filesystem prefix",
    format: String,
    default: `${Date.now().toString()}/`,
    arg: "filesystem-prefix",
    env: "COSMOSDB_CLI_FILESYSTEM_PREFIX",
  },
  filesystem_suffix: {
    doc: "Filesystem suffix",
    format: String,
    default: "",
    arg: "filesystem-suffix",
    env: "COSMOSDB_CLI_FILESYSTEM_SUFFIX",
  },
  filesystem_delimiter: {
    doc: "Filesystem delimiter",
    format: String,
    default: "/",
    arg: "filesystem-delimiter",
    env: "COSMOSDB_CLI_FILESYSTEM_DELIMITER",
  },
};

// functions
const to_config = <T>(schema: Schema<T>): Promise<Config<T>> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(Convict(schema));
    } catch (e) {
      reject(e);
    }
  });
};

export const get_cosmosdb_config = (): Promise<cosmosdb> =>
  to_config(cosmosdb).then((config) => {
    return {
      cosmosdb_account_endpoint: config.get("cosmosdb_account_endpoint"),
      cosmosdb_account_key: config.get("cosmosdb_account_key"),
      cosmosdb_reject_unauthorized: config.get("cosmosdb_reject_unauthorized"),
    };
  });

export const get_azure_storage_account_config = (): Promise<
  azure_storage_account
> =>
  to_config(azure_storage_account).then((config) => {
    return {
      storage_account_name: config.get("storage_account_name"),
      storage_account_container: config.get("storage_account_container"),
      storage_account_key: config.get("storage_account_key"),
      storage_account_prefix: config.get("storage_account_prefix"),
      storage_account_suffix: config.get("storage_account_suffix"),
      storage_account_delimiter: config.get("storage_account_delimiter"),
      storage_account_protocol: config.get("storage_account_protocol"),
      storage_account_connectionstring_suffix: config.get(
        "storage_account_connectionstring_suffix"
      ),
    };
  });

export const get_filesystem_config = (): Promise<filesystem> =>
  to_config(filesystem).then((config) => {
    return {
      filesystem_path: config.get("filesystem_path"),
      filesystem_prefix: config.get("filesystem_prefix"),
      filesystem_suffix: config.get("filesystem_suffix"),
      filesystem_delimiter: config.get("filesystem_delimiter"),
    };
  });
