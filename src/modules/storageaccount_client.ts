import logger from "./logger";
import {
  ContainerClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export function storage_account_container_client(
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
      function: "storage_account_container_client",
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

export async function upload_content_to_storage_account_container(
  content: string,
  blob_name: string,
  container_client: ContainerClient
): Promise<void> {
  try {
    const block_blob_client = StorageAccountBlockBlobClient(
      container_client,
      blob_name
    );
    logger.debug({
      function: "upload_content_to_storage_account_container",
      message: `Uploading up to ${blob_name}`,
    });
    await block_blob_client.upload(content, Buffer.byteLength(content));
    logger.debug({
      function: "upload_content_to_storage_account_container",
      message: `Finished upload to ${blob_name}`,
    });
  } catch (e) {
    logger.error({
      function: "upload_content_to_storage_account_container",
      error: e,
    });
    process.exit(1);
  }
}
