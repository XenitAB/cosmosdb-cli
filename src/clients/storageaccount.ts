import {
  ContainerClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export const container_client = (
  account: string,
  container: string,
  key: string
): Promise<ContainerClient> => {
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

export const save_content = async (
  content: string,
  blob_name: string,
  container_client: ContainerClient
): Promise<void> => {
  return new Promise((_resolve, reject) => {
    block_blob_client(container_client, blob_name).then((client) => {
      client
        .upload(content, Buffer.byteLength(content))
        .then((_) => _resolve())
        .catch(reject);
    });
  });
};
