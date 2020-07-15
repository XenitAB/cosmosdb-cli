import logger from "./logger";
import * as Cosmosdb_client from "./cosmosdb_client";
import * as Storageaccount_client from "./storageaccount_client";
import * as Config from "./config";
import * as Fs_client from "./fs_client";
import { ContainerClient } from "@azure/storage-blob";

export const client = async (config: Config.t): Promise<void> => {
  try {
    switch (config.type) {
      case "azure-storage-account": {
        const client = Cosmosdb_client.client(
          config.cosmosdb_account_endpoint,
          config.cosmosdb_account_key
        );
        const cosmosdb_items = await Cosmosdb_client.get_items(client);
        const container_client = Storageaccount_client.container_client(
          config.storage_account_name,
          config.storage_account_container,
          config.storage_account_key
        );
        await backup_cosmosdb_containers_to_storage_account_blob(
          cosmosdb_items,
          container_client,
          `${Date.now().toString()}/`
        );
        break;
      }
      case "filesystem": {
        const client = Cosmosdb_client.client(
          config.cosmosdb_account_endpoint,
          config.cosmosdb_account_key
        );
        const cosmosdb_items = await Cosmosdb_client.get_items(client);
        await backup_cosmosdb_containers_to_filesystem(
          cosmosdb_items,
          config.filesystem_path,
          `${Date.now().toString()}/`
        );
        break;
      }
      default: {
        logger.error({
          module: "Backup_client.backup_client",
          error: "No storage location defined.",
        });
        break;
      }
    }
  } catch (e) {
    logger.error({
      module: "Backup_client.backup_client",
      error: e,
    });
    process.exit(1);
  }
};

const backup_cosmosdb_containers_to_storage_account_blob = async (
  cosmosdb_items: Cosmosdb_client.items,
  container_client: ContainerClient,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> => {
  try {
    const prefix_string = prefix === undefined ? "" : prefix;
    const suffix_string = suffix === undefined ? "" : suffix;
    const delimiter_string = delimiter === undefined ? "/" : delimiter;

    await Promise.all(
      cosmosdb_items.map((containers) => {
        const db_id = containers.db_id;
        const continer_id = containers.container_id;
        const blob_name = `${prefix_string}${db_id}${delimiter_string}${continer_id}${suffix_string}`;
        const items = JSON.stringify(containers.items);

        Storageaccount_client.save_content(items, blob_name, container_client);
      })
    );
  } catch (e) {
    logger.error({
      function:
        "Backup_client.backup_cosmosdb_containers_to_storage_account_blob",
      error: e,
    });
    process.exit(1);
  }
};

const backup_cosmosdb_containers_to_filesystem = async (
  cosmosdb_items: Cosmosdb_client.items,
  file_path: string,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> => {
  try {
    const prefix_string = prefix === undefined ? "" : prefix;
    const suffix_string = suffix === undefined ? "" : suffix;
    const delimiter_string = delimiter === undefined ? "/" : delimiter;

    await Promise.all(
      cosmosdb_items.map((containers) => {
        const db_id = containers.db_id;
        const continer_id = containers.container_id;
        const file_name = `${file_path}${prefix_string}${db_id}${delimiter_string}${continer_id}${suffix_string}`;
        const items = JSON.stringify(containers.items);

        Fs_client.save_item(items, file_name);
      })
    );
  } catch (e) {
    logger.error({
      module: "Backup_client.backup_cosmosdb_containers_to_filesystem",
      error: e,
    });
    process.exit(1);
  }
};
