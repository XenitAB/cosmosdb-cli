import JsonStreamStringify from "json-stream-stringify";

import * as Fs_client from "./fs";

import * as Storageaccount_client from "./storageaccount";
import logger from "./logger";

import * as Cosmosdb_models from "../models/cosmosdb";
import * as Config_models from "../models/config";

const save_item_to_storage_account = (
  azure_storage_account: Config_models.azure_storage_account,
  items_by_container: Cosmosdb_models.items_by_container
): Promise<void> => {
  // If there are no items in the list there's no work to do
  if (items_by_container.items.length === 0) {
    const { items, ...container } = items_by_container;
    logger.info({
      location: "Backup.save_item_to_storage_account",
      msg: "No items in list",
      container: container,
    });
    return Promise.resolve();
  }
  const account_name = items_by_container.account_name;
  const db_id = items_by_container.db_id;
  const container_id = items_by_container.container_id;
  const prefix_string = azure_storage_account.storage_account_prefix;
  const suffix_string = azure_storage_account.storage_account_suffix;
  const delimiter_string = azure_storage_account.storage_account_delimiter;
  // Datafactory format: accountname / databasename / collectionname / timestamp / backup.json
  const use_datafactory_format =
    azure_storage_account.storage_account_use_datafactory_format;
  const datafactory_date = new Date();
  const datafactory_iso_date = datafactory_date.toISOString();

  const blob_name = use_datafactory_format
    ? `${account_name}/${db_id}/${container_id}/${datafactory_iso_date}/backup.json`
    : `${prefix_string}${db_id}${delimiter_string}${container_id}${suffix_string}`;

  const items = new JsonStreamStringify(items_by_container.items);

  return Storageaccount_client.save_item(
    items,
    blob_name,
    azure_storage_account
  );
};

const save_items_to_storage_account = (
  azure_storage_account: Config_models.azure_storage_account,
  items_by_containers: Cosmosdb_models.items_by_containers
): Promise<void> => {
  const [items_by_container, ...rest] = items_by_containers;
  if (rest.length === 0) {
    return save_item_to_storage_account(
      azure_storage_account,
      items_by_container
    );
  } else {
    return save_item_to_storage_account(
      azure_storage_account,
      items_by_container
    ).then(() => save_items_to_storage_account(azure_storage_account, rest));
  }
};

export const backup_cosmosdb_containers_to_storage_account_blob = (
  azure_storage_account: Config_models.azure_storage_account,
  items_by_containers: Cosmosdb_models.items_by_containers
): Promise<void> => {
  return save_items_to_storage_account(
    azure_storage_account,
    items_by_containers
  );
};

const save_item_to_fs = (
  filesystem: Config_models.filesystem,
  items_by_container: Cosmosdb_models.items_by_container
): Promise<void> => {
  const db_id = items_by_container.db_id;
  const container_id = items_by_container.container_id;
  const file_path = filesystem.filesystem_path;
  const prefix_string = filesystem.filesystem_prefix;
  const suffix_string = filesystem.filesystem_suffix;
  const delimiter_string = filesystem.filesystem_delimiter;
  const file_name = `${file_path}${prefix_string}${db_id}${delimiter_string}${container_id}${suffix_string}`;
  const items = new JsonStreamStringify(items_by_container.items);

  return Fs_client.save_item(items, file_name);
};

const save_items_to_fs = (
  filesystem: Config_models.filesystem,
  items_by_containers: Cosmosdb_models.items_by_containers
): Promise<void> => {
  const [items_by_container, ...rest] = items_by_containers;
  if (rest.length === 0) {
    return save_item_to_fs(filesystem, items_by_container);
  } else {
    return save_item_to_fs(filesystem, items_by_container).then(() =>
      save_items_to_fs(filesystem, rest)
    );
  }
};

export const backup_cosmosdb_containers_to_filesystem = (
  filesystem: Config_models.filesystem,
  items_by_containers: Cosmosdb_models.items_by_containers
): Promise<void> => {
  return save_items_to_fs(filesystem, items_by_containers);
};
