import * as Config_models from "../models/config";
import { save_item } from "./storageaccount";
import { v4 as uuidv4 } from "uuid";
import { BlobServiceClient } from "@azure/storage-blob";
import logger from "./logger";

logger.info = jest.fn();

const date = Date.now();
const random_string = uuidv4();
const blob_name = `${random_string}/${date}.txt`;
const mock_object = {
  date,
  uuid: random_string,
  test: true,
  something: "test",
};
const json_data = JSON.stringify(mock_object);

const mock_azure_storage_account: Config_models.azure_storage_account = {
  storage_account_name: "devstoreaccount1",
  storage_account_container: `devcontainer${date}`,
  storage_account_key:
    "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==",
  storage_account_delimiter: "/",
  storage_account_prefix: `${Date.now().toString()}/`,
  storage_account_suffix: "",
  storage_account_protocol: "http",
  storage_account_connectionstring_suffix:
    "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;",
};

const account = mock_azure_storage_account.storage_account_name;
const key = mock_azure_storage_account.storage_account_key;
const container = mock_azure_storage_account.storage_account_container;
const protocol = mock_azure_storage_account.storage_account_protocol;
const connection_string_suffix =
  mock_azure_storage_account.storage_account_connectionstring_suffix;
const blob_service_client = BlobServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=${protocol};AccountName=${account};AccountKey=${key};${connection_string_suffix}`
);
const container_client = blob_service_client.getContainerClient(container);
const block_blob_client = container_client.getBlockBlobClient(blob_name);

describe("storageaccount tests", () => {
  beforeAll(() => {
    return container_client.create();
  });

  afterAll(() => {
    return container_client.delete();
  });

  it("should create file with json data", (done) => {
    expect.assertions(1);
    save_item(json_data, blob_name, mock_azure_storage_account)
      .then(() => block_blob_client.download(0))
      .then((stream) => {
        return streamToString(
          stream.readableStreamBody as NodeJS.ReadableStream
        ).then((output) => expect(JSON.parse(output)).toEqual(mock_object));
      })
      .then(done);
  });
  it("should fail when using unknown container", (done) => {
    expect.assertions(1);
    expect(
      save_item(json_data, blob_name, {
        ...mock_azure_storage_account,
        storage_account_container: "does-not-exist",
      })
    )
      .rejects.toThrow()
      .then(done);
  });
  it("should fail when using wrong key", (done) => {
    expect.assertions(1);
    expect(
      save_item(json_data, blob_name, {
        ...mock_azure_storage_account,
        storage_account_key: "this-is-wrong",
      })
    )
      .rejects.toThrow()
      .then(done);
  });
});

const streamToString = (
  readableStream: NodeJS.ReadableStream
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
};
