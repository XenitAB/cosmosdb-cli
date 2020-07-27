// import * as Storageaccount_client from "./storageaccount";
import * as Fs_client from "./fs";
import * as Storageaccount_client from "./storageaccount";
import * as Cosmosdb_models from "../models/cosmosdb";
import * as Config_models from "../models/config";

const save_item_to_storage_account = (
  azure_storage_account: Config_models.azure_storage_account,
  items_by_containers: Cosmosdb_models.items_by_container,
  prefix_string: string,
  suffix_string: string,
  delimiter_string: string
): Promise<void> => {
  const db_id = items_by_containers.db_id;
  const continer_id = items_by_containers.container_id;
  const blob_name = `${prefix_string}${db_id}${delimiter_string}${continer_id}${suffix_string}`;
  const items = JSON.stringify(items_by_containers.items);

  return Storageaccount_client.save_item(
    items,
    blob_name,
    azure_storage_account
  );
};

const save_items_to_storage_account = (
  azure_storage_account: Config_models.azure_storage_account,
  items_by_containers: Cosmosdb_models.items_by_containers,
  prefix_string: string,
  suffix_string: string,
  delimiter_string: string
): Promise<void> => {
  const [items_by_container, ...rest] = items_by_containers;
  if (rest.length === 0) {
    return save_item_to_storage_account(
      azure_storage_account,
      items_by_container,
      prefix_string,
      suffix_string,
      delimiter_string
    );
  } else {
    return save_item_to_storage_account(
      azure_storage_account,
      items_by_container,
      prefix_string,
      suffix_string,
      delimiter_string
    ).then(() =>
      save_items_to_storage_account(
        azure_storage_account,
        rest,
        prefix_string,
        suffix_string,
        delimiter_string
      )
    );
  }
};

export const backup_cosmosdb_containers_to_storage_account_blob = (
  azure_storage_account: Config_models.azure_storage_account,
  items_by_containers: Cosmosdb_models.items_by_containers,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> => {
  const prefix_string = prefix === undefined ? "" : prefix;
  const suffix_string = suffix === undefined ? "" : suffix;
  const delimiter_string = delimiter === undefined ? "/" : delimiter;
  return save_items_to_storage_account(
    azure_storage_account,
    items_by_containers,
    prefix_string,
    suffix_string,
    delimiter_string
  );
};

const save_item_to_fs = (
  items_by_container: Cosmosdb_models.items_by_container,
  file_path: string,
  prefix_string: string,
  suffix_string: string,
  delimiter_string: string
): Promise<void> => {
  const db_id = items_by_container.db_id;
  const container_id = items_by_container.container_id;
  const file_name = `${file_path}${prefix_string}${db_id}${delimiter_string}${container_id}${suffix_string}`;
  const items = JSON.stringify(items_by_container.items);

  return Fs_client.save_item(items, file_name);
};

const save_items_to_fs = (
  items_by_containers: Cosmosdb_models.items_by_containers,
  file_path: string,
  prefix_string: string,
  suffix_string: string,
  delimiter_string: string
): Promise<void> => {
  const [items_by_container, ...rest] = items_by_containers;
  if (rest.length === 0) {
    return save_item_to_fs(
      items_by_container,
      file_path,
      prefix_string,
      suffix_string,
      delimiter_string
    );
  } else {
    return save_item_to_fs(
      items_by_container,
      file_path,
      prefix_string,
      suffix_string,
      delimiter_string
    ).then(() =>
      save_items_to_fs(
        rest,
        file_path,
        prefix_string,
        suffix_string,
        delimiter_string
      )
    );
  }
};

export const backup_cosmosdb_containers_to_filesystem = (
  filesystem: Config_models.filesystem,
  items_by_containers: Cosmosdb_models.items_by_containers,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> => {
  const file_path = filesystem.filesystem_path;
  const prefix_string = prefix === undefined ? "" : prefix;
  const suffix_string = suffix === undefined ? "" : suffix;
  const delimiter_string = delimiter === undefined ? "/" : delimiter;
  return save_items_to_fs(
    items_by_containers,
    file_path,
    prefix_string,
    suffix_string,
    delimiter_string
  );
};
