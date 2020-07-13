# CosmosDB CLI Client

CLI client to handle backup of CosmosDB.

## How to use

## Backup to Azure Storage Account

### Backup to Azure Storage Account Using Command Line Parameters

```shell
cosmosdb-cli backup azure-storage-account --cosmosdb-account-endpoint https://<cosmosdb-account-name>.documents.azure.com:443/ --cosmosdb-account-key <cosmosdb-account-key> --storage-account-name <storage-account-name> --storage-account-container <storage-account-container> --storage-account-key <storage-account-key>
```

### Backup to Azure Storage Account Using Environment Variables

```shell
export COSMOSDB_ACCOUNT_ENDPOINT="https://<cosmosdb-account-name>.documents.azure.com:443/"
export COSMOSDB_ACCOUNT_KEY="<cosmosdb-account-key>"
export STORAGE_ACCOUNT_NAME="<storage-account-name>"
export STORAGE_ACCOUNT_CONTAINER="<storage-account-container>"
export STORAGE_ACCOUNT_KEY="<storage-account-key>"

cosmosdb-cli backup azure-storage-account
```

## Backup to File System

### Backup to File System Using Command Line Parameters

```shell
cosmosdb-cli backup azure-storage-account --cosmosdb-account-endpoint https://<cosmosdb-account-name>.documents.azure.com:443/ --cosmosdb-account-key <cosmosdb-account-key> --filesystem-path /tmp/
```

### Backup to File System Using Environment Variables

```shell
export COSMOSDB_ACCOUNT_ENDPOINT="https://<cosmosdb-account-name>.documents.azure.com:443/"
export COSMOSDB_ACCOUNT_KEY="<cosmosdb-account-key>"
export FILESYSTEM_PATH="/tmp/"

cosmosdb-cli backup file-system
```
