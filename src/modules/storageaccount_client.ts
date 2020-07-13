import logger from "./logger";
import {
  ContainerClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export function StorageAccountContainerClient(
  account: string,
  container: string,
  key: string
): ContainerClient {
  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
    const containerClient = new ContainerClient(
      `https://${account}.blob.core.windows.net/${container}`,
      sharedKeyCredential
    );
    return containerClient;
  } catch (e) {
    logger.error({
      function: "StorageAccountContainerClient",
      error: e,
    });
    process.exit(1);
  }
}

export function StorageAccountBlockBlobClient(
  container_client: ContainerClient,
  blob_name: string
): BlockBlobClient {
  try {
    const blockBlobClient = container_client.getBlockBlobClient(blob_name);
    return blockBlobClient;
  } catch (e) {
    logger.error({
      function: "StorageAccountBlockBlobClient",
      error: e,
    });
    process.exit(1);
  }
}

export async function UploadContentToStorageAccountContainer(
  content: string,
  blob_name: string,
  container_client: ContainerClient
): Promise<void> {
  try {
    const block_blob_client = StorageAccountBlockBlobClient(
      container_client,
      blob_name
    );
    logger.debug(`Backing up to ${blob_name}`);
    await block_blob_client.upload(content, Buffer.byteLength(content));
    logger.debug(`Finished backup to ${blob_name}`);
  } catch (e) {
    logger.error({
      function: "UploadContentToStorageAccountContainer",
      error: e,
    });
    process.exit(1);
  }
}
