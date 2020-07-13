import logger from "./logger";
import { CosmosDBItemsType } from "./cosmosdb_client";
import { UploadContentToStorageAccountContainer } from "./storageaccount_client";
import { ContainerClient } from "@azure/storage-blob";
import { GetCosmosDBItems, CosmosDBClient } from "./cosmosdb_client";
import { StorageAccountContainerClient } from "./storageaccount_client";
import { config, GetConfigString } from "./config";

export async function BackupClient(
  location: string,
  cmdObj?: any
): Promise<void> {
  switch (location) {
    case "azure-storage-account": {
      const cosmosdb_client = CosmosDBClient(
        GetConfigString(config.cosmosdb_account_endpoint, cmdObj),
        GetConfigString(config.cosmosdb_account_key, cmdObj)
      );
      const cosmosdb_items = await GetCosmosDBItems(cosmosdb_client);
      const container_client = StorageAccountContainerClient(
        GetConfigString(config.storage_account_name, cmdObj),
        GetConfigString(config.storage_account_container, cmdObj),
        GetConfigString(config.storage_account_key, cmdObj)
      );
      await BackupCosmosDBContainersToStorageAccountBlob(
        cosmosdb_items,
        container_client,
        `${Date.now().toString()}/`
      );
      break;
    }
    default: {
      logger.error("No storage location defined.");
      break;
    }
  }
}

export async function BackupCosmosDBContainersToStorageAccountBlob(
  cosmosdb_items: CosmosDBItemsType,
  container_client: ContainerClient,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> {
  try {
    await Promise.all(
      cosmosdb_items.map((containers) => {
        const prefix_string = prefix === undefined ? "" : prefix;
        const suffix_string = suffix === undefined ? "" : suffix;
        const delimiter_string = delimiter === undefined ? "/" : delimiter;

        const db_id = containers.db_id;
        const continer_id = containers.container_id;
        const blob_name = `${prefix_string}${db_id}${delimiter_string}${continer_id}${suffix_string}`;
        const items = JSON.stringify(containers.items);

        UploadContentToStorageAccountContainer(
          items,
          blob_name,
          container_client
        );
      })
    );
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
