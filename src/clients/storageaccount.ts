import {
  ContainerClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import * as Config_models from "../models/config";
import logger from "./logger";

const container_client = (
  azure_storage_account: Config_models.azure_storage_account
): Promise<ContainerClient> => {
  const account = azure_storage_account.storage_account_name;
  const key = azure_storage_account.storage_account_key;
  const container = azure_storage_account.storage_account_container;
  return new Promise((resolve, reject) => {
    try {
      const shared_key_credential = new StorageSharedKeyCredential(
        account,
        key
      );
      const container_client = new ContainerClient(
        `https://${account}.blob.core.windows.net/${container}`,
        shared_key_credential
      );
      resolve(container_client);
    } catch (e) {
      reject(e);
    }
  });
};

const block_blob_client = (
  container_client: ContainerClient,
  blob_name: string
): Promise<BlockBlobClient> => {
  return new Promise((resolve, reject) => {
    try {
      const block_blob_client = container_client.getBlockBlobClient(blob_name);
      resolve(block_blob_client);
    } catch (e) {
      reject(e);
    }
  });
};

export const save_item = (
  content: string,
  blob_name: string,
  azure_storage_account: Config_models.azure_storage_account
): Promise<void> => {
  logger.info({
    location: "Storageaccount.save_item",
    msg: "Saving item",
    destination: blob_name,
  });
  return container_client(azure_storage_account)
    .then((container_client) => block_blob_client(container_client, blob_name))
    .then((client) => client.upload(content, Buffer.byteLength(content)))
    .then((_) => {
      logger.info({
        location: "Storageaccount.save_item",
        msg: "Saved item",
        destination: blob_name,
      });
    });
};
