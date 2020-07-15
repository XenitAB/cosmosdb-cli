import logger from "./Logger";
import {
  ContainerClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export const container_client = (
  account: string,
  container: string,
  key: string
): ContainerClient => {
  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
    const containerClient = new ContainerClient(
      `https://${account}.blob.core.windows.net/${container}`,
      sharedKeyCredential
    );
    return containerClient;
  } catch (e) {
    logger.error({
      module: "Storageaccount_client.container_client",
      error: e,
    });
    process.exit(1);
  }
};

const block_blob_client = (
  container_client: ContainerClient,
  blob_name: string
): BlockBlobClient => {
  try {
    const blockBlobClient = container_client.getBlockBlobClient(blob_name);
    return blockBlobClient;
  } catch (e) {
    logger.error({
      module: "Storageaccount_client.block_blob_client",
      error: e,
    });
    process.exit(1);
  }
};

export const save_content = async (
  content: string,
  blob_name: string,
  container_client: ContainerClient
): Promise<void> => {
  try {
    const client = block_blob_client(container_client, blob_name);
    logger.debug({
      module: "Storageaccount_client.save_content",
      message: `Uploading up to ${blob_name}`,
    });
    await client.upload(content, Buffer.byteLength(content));
    logger.debug({
      module: "Storageaccount_client.save_content",
      message: `Finished upload to ${blob_name}`,
    });
  } catch (e) {
    logger.error({
      module: "Storageaccount_client.save_content",
      error: e,
    });
    process.exit(1);
  }
};
