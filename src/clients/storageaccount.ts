import {
  ContainerClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import * as Config_models from "../models/config";
import Convict from "convict";
import logger from "./logger";

export const container_client = (
  config: Convict.Config<Config_models.azure_storage_account>
): Promise<ContainerClient> => {
  const account = config.get("storage_account_name");
  const key = config.get("storage_account_key");
  const container = config.get("storage_account_container");
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
  container_client: ContainerClient
): Promise<void> => {
  logger.info({
    location: "Storageaccount.save_item",
    msg: "Saving item",
    destination: blob_name,
  });
  return block_blob_client(container_client, blob_name)
    .then((client) => client.upload(content, Buffer.byteLength(content)))
    .then((_) => {
      logger.info({
        location: "Storageaccount.save_item",
        msg: "Saved item",
        destination: blob_name,
      });
    });
};
