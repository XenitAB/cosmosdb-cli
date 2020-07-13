import logger from "./logger";
import { cosmosdb_items_type } from "./cosmosdb_client";
import { upload_content_to_storage_account_container } from "./storageaccount_client";
import { ContainerClient } from "@azure/storage-blob";
import { get_cosmosdb_items, cosmosdb_client } from "./cosmosdb_client";
import { storage_account_container_client } from "./storageaccount_client";
import { config, get_config_string } from "./config";
import { save_content_to_filesystem } from "./fs_client";
import { cli_arguments } from "./cli_client";

export async function backup_client(
  location: string,
  cmdObj?: cli_arguments
): Promise<void> {
  try {
    switch (location) {
      case "azure-storage-account": {
        const client = cosmosdb_client(
          get_config_string(config.cosmosdb_account_endpoint, cmdObj),
          get_config_string(config.cosmosdb_account_key, cmdObj)
        );
        const cosmosdb_items = await get_cosmosdb_items(client);
        const container_client = storage_account_container_client(
          get_config_string(config.storage_account_name, cmdObj),
          get_config_string(config.storage_account_container, cmdObj),
          get_config_string(config.storage_account_key, cmdObj)
        );
        await backup_cosmosdb_containers_to_storage_account_blob(
          cosmosdb_items,
          container_client,
          `${Date.now().toString()}/`
        );
        break;
      }
      case "file-system": {
        const client = cosmosdb_client(
          get_config_string(config.cosmosdb_account_endpoint, cmdObj),
          get_config_string(config.cosmosdb_account_key, cmdObj)
        );
        const cosmosdb_items = await get_cosmosdb_items(client);
        await backup_cosmosdb_containers_to_filesystem(
          cosmosdb_items,
          get_config_string(config.filesystem_path, cmdObj),
          `${Date.now().toString()}/`
        );
        break;
      }
      default: {
        logger.error({
          function: "backup_client",
          error: "No storage location defined.",
        });
        break;
      }
    }
  } catch (e) {
    logger.error({
      function: "backup_client",
      error: e,
    });
    process.exit(1);
  }
}

export async function backup_cosmosdb_containers_to_storage_account_blob(
  cosmosdb_items: cosmosdb_items_type,
  container_client: ContainerClient,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> {
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

        upload_content_to_storage_account_container(
          items,
          blob_name,
          container_client
        );
      })
    );
  } catch (e) {
    logger.error({
      function: "backup_cosmosdb_containers_to_storage_account_blob",
      error: e,
    });
    process.exit(1);
  }
}

export async function backup_cosmosdb_containers_to_filesystem(
  cosmosdb_items: cosmosdb_items_type,
  file_path: string,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> {
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

        save_content_to_filesystem(items, file_name);
      })
    );
  } catch (e) {
    logger.error({
      function: "backup_cosmosdb_containers_to_filesystem",
      error: e,
    });
    process.exit(1);
  }
}
