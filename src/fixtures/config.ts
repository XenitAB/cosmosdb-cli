import * as Convict from "convict";
import * as Config_models from "../models/config";

export const cosmosdb: Convict.Schema<Config_models.cosmosdb> = {
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

export const azure_storage_account: Convict.Schema<Config_models.azure_storage_account> = {
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

export const filesystem: Convict.Schema<Config_models.filesystem> = {
  filesystem_path: {
    doc: "Filesystem path",
    format: String,
    default: null,
    arg: "filesystem-path",
    env: "COSMOSDB_CLI_FILESYSTEM_PATH",
  },
};
