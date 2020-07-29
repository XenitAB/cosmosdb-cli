import {
  ContainerClient,
  BlockBlobClient,
  BlobServiceClient,
} from "@azure/storage-blob";
import * as Config_models from "../models/config";
import logger from "./logger";

const container_client = (
  azure_storage_account: Config_models.azure_storage_account
): Promise<ContainerClient> => {
  const account = azure_storage_account.storage_account_name;
  const key = azure_storage_account.storage_account_key;
  const container = azure_storage_account.storage_account_container;
  const protocol = azure_storage_account.storage_account_protocol;
  const connection_string_suffix =
    azure_storage_account.storage_account_connectionstring_suffix;
  return new Promise((resolve) => {
    const blob_service_client = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=${protocol};AccountName=${account};AccountKey=${key};${connection_string_suffix}`
    );
    const container_client = blob_service_client.getContainerClient(container);
    resolve(container_client);
  });
};

const block_blob_client = (
  container_client: ContainerClient,
  blob_name: string
): Promise<BlockBlobClient> => {
  return new Promise((resolve) => {
    const block_blob_client = container_client.getBlockBlobClient(blob_name);
    resolve(block_blob_client);
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
