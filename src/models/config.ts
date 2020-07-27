import Convict, { Config, Schema } from "convict";

// types
export type cosmosdb = {
  cosmosdb_account_endpoint: string;
  cosmosdb_account_key: string;
};

export type azure_storage_account = {
  storage_account_name: string;
  storage_account_container: string;
  storage_account_key: string;
};

export type filesystem = {
  filesystem_path: string;
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
};

const filesystem: Schema<filesystem> = {
  filesystem_path: {
    doc: "Filesystem path",
    format: String,
    default: null,
    arg: "filesystem-path",
    env: "COSMOSDB_CLI_FILESYSTEM_PATH",
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
    };
  });

export const get_filesystem_config = (): Promise<filesystem> =>
  to_config(filesystem).then((config) => {
    return {
      filesystem_path: config.get("filesystem_path"),
    };
  });
