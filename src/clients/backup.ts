// import * as Storageaccount_client from "./storageaccount";
import * as Fs_client from "./fs";
import * as Cosmosdb_models from "../models/cosmosdb";
import { rejects } from "assert";
// import { ContainerClient } from "@azure/storage-blob";

// export const backup_cosmosdb_containers_to_storage_account_blob = (
//   cosmosdb_items: Cosmosdb_models.items_by_containers,
//   container_client: ContainerClient,
//   prefix?: string,
//   suffix?: string,
//   delimiter?: string
// ): Promise<void> => {
//   return new Promise((_resolve, reject) => {
//     try {
//       const prefix_string = prefix === undefined ? "" : prefix;
//       const suffix_string = suffix === undefined ? "" : suffix;
//       const delimiter_string = delimiter === undefined ? "/" : delimiter;
//       cosmosdb_items.map((containers) => {
//         const db_id = containers.db_id;
//         const continer_id = containers.container_id;
//         const blob_name = `${prefix_string}${db_id}${delimiter_string}${continer_id}${suffix_string}`;
//         const items = JSON.stringify(containers.items);

//         Storageaccount_client.save_content(
//           items,
//           blob_name,
//           container_client
//         ).catch(reject);
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const save_item_to_fs = (
  items_by_container: Cosmosdb_models.items_by_container,
  file_path: string,
  prefix_string: string,
  suffix_string: string,
  delimiter_string: string
): Promise<void> => {
  return new Promise((_resolve, reject) => {
    const db_id = items_by_container.db_id;
    const container_id = items_by_container.container_id;
    const file_name = `${file_path}${prefix_string}${db_id}${delimiter_string}${container_id}${suffix_string}`;
    const items = JSON.stringify(items_by_container.items);
    console.log("Backing up: " + file_name);
    Fs_client.save_item(items, file_name)
      .then((_) => console.log("Finished backup of: " + file_name))
      .then(_resolve)
      .catch(reject);
  });
};

const save_items_to_fs = (
  items_by_containers: Cosmosdb_models.items_by_containers,
  file_path: string,
  prefix_string: string,
  suffix_string: string,
  delimiter_string: string
): Promise<void> => {
  return new Promise((_resolve, reject) => {
    if (items_by_containers.length === 1) {
      save_item_to_fs(
        items_by_containers[0],
        file_path,
        prefix_string,
        suffix_string,
        delimiter_string
      )
        .then(_resolve)
        .catch(reject);
    } else {
      save_item_to_fs(
        items_by_containers[items_by_containers.length - 1],
        file_path,
        prefix_string,
        suffix_string,
        delimiter_string
      ).then(() => {
        items_by_containers.pop();
        save_items_to_fs(
          items_by_containers,
          file_path,
          prefix_string,
          suffix_string,
          delimiter_string
        )
          .then(_resolve)
          .catch(reject);
      });
    }
  });
};

export const backup_cosmosdb_containers_to_filesystem = (
  items_by_containers: Cosmosdb_models.items_by_containers,
  file_path: string,
  prefix?: string,
  suffix?: string,
  delimiter?: string
): Promise<void> => {
  return new Promise((_resolve, reject) => {
    try {
      const prefix_string = prefix === undefined ? "" : prefix;
      const suffix_string = suffix === undefined ? "" : suffix;
      const delimiter_string = delimiter === undefined ? "/" : delimiter;
      save_items_to_fs(
        items_by_containers,
        file_path,
        prefix_string,
        suffix_string,
        delimiter_string
      )
        .then(_resolve)
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};
