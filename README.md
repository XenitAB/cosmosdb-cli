# CosmosDB CLI Client

[![Docker Repository on Quay](https://quay.io/repository/xenitab/cosmosdb-cli/status "Docker Repository on Quay")](https://quay.io/repository/xenitab/cosmosdb-cli)

CLI client to handle backup of CosmosDB.

# Background

This project was created for me to learn functional programming using TypeScript. It's a fun side project and hopefully something that can be used to help someone in the future.

# Container Image

Container image available at: quay.io/xenitab/cosmosdb-cli

## Running Container

```shell
docker run -it quay.io/xenitab/cosmosdb-cli:<version> backup azure-storage-account --cosmosdb-account-endpoint <cosmosdb-account-endpoint> --cosmosdb-account-key <cosmosdb-account-key> --storage-account-name <storage-account-name> --storage-account-container <storage-account-container> --storage-account-key <storage-account-key>
```

# How to use

## Azure Key Vault

You can grab secrets from Azure KeyVault for CosmosDB and Azure Storage Account. It will work with Environment Variables, Managed Service Identity and Azure CLI credentials (local file).

Read more here: https://www.npmjs.com/package/@azure/identity

```shell
backup azure-storage-account --keyvault-name kvcdblab --cosmosdb-use-keyvault true --storage-account-use-keyvault true --storage-account-container backup-container
```

The above will grab `CosmosDB Account Name`, `CosmosDB Account Key`, `Storage Account Name` and `Storage Acccount key` from Azure KeyVault. Take a look in [config.ts](src/models/config.ts) to see the default secret names. They can be changed using environment variables and command line arguments.

## Backup to Azure Storage Account

### Backup to Azure Storage Account Using Command Line Parameters

```shell
cosmosdb-cli backup azure-storage-account --cosmosdb-account-endpoint https://<cosmosdb-account-name>.documents.azure.com:443/ --cosmosdb-account-key <cosmosdb-account-key> --storage-account-name <storage-account-name> --storage-account-container <storage-account-container> --storage-account-key <storage-account-key>
```

### Backup to Azure Storage Account Using Environment Variables

```shell
export COSMOSDB_CLI_COSMOSDB_ACCOUNT_ENDPOINT="https://<cosmosdb-account-name>.documents.azure.com:443/"
export COSMOSDB_CLI_COSMOSDB_ACCOUNT_KEY="<cosmosdb-account-key>"
export COSMOSDB_CLI_STORAGE_ACCOUNT_NAME="<storage-account-name>"
export COSMOSDB_CLI_STORAGE_ACCOUNT_CONTAINER="<storage-account-container>"
export COSMOSDB_CLI_STORAGE_ACCOUNT_KEY="<storage-account-key>"

cosmosdb-cli backup azure-storage-account
```

## Backup to File System

### Backup to File System Using Command Line Parameters

```shell
cosmosdb-cli backup azure-storage-account --cosmosdb-account-endpoint https://<cosmosdb-account-name>.documents.azure.com:443/ --cosmosdb-account-key <cosmosdb-account-key> --filesystem-path /tmp/
```

### Backup to File System Using Environment Variables

```shell
export COSMOSDB_CLI_COSMOSDB_ACCOUNT_ENDPOINT="https://<cosmosdb-account-name>.documents.azure.com:443/"
export COSMOSDB_CLI_COSMOSDB_ACCOUNT_KEY="<cosmosdb-account-key>"
export COSMOSDB_CLI_FILESYSTEM_PATH="/tmp/"

cosmosdb-cli backup filesystem
```
