import { Config, Schema } from "convict";

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

// configs
export type cosmosdb_config = Config<cosmosdb>;
export type azure_storage_account_config = Config<azure_storage_account>;
export type filesystem_config = Config<filesystem>;

// schemas
export const cosmosdb: Schema<cosmosdb> = {
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

export const azure_storage_account: Schema<azure_storage_account> = {
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

export const filesystem: Schema<filesystem> = {
  filesystem_path: {
    doc: "Filesystem path",
    format: String,
    default: null,
    arg: "filesystem-path",
    env: "COSMOSDB_CLI_FILESYSTEM_PATH",
  },
};
