import {
  get_cosmosdb_client,
  start_cosmosdb_server,
  create_cosmosdb_db_container_items,
  stop_cosmosdb_server,
  remove_all_cosmosdb_databases,
} from "../helpers";
import * as Config_models from "../../models/config";
import { ItemDefinition } from "@azure/cosmos";
import cosmosdb_server from "@zeit/cosmosdb-server";
import * as Args_model from "../../models/args";
import * as Commands_model from "../../models/commands";
import * as Cli_client from "../../clients/cli";
import { BlobServiceClient } from "@azure/storage-blob";
import { stream_to_string } from "../helpers";
import logger from "../../clients/logger";

const date_string = Date.now().toString();

const mock_port = 3001;
const mock_cosmosdb: Config_models.cosmosdb = {
  cosmosdb_account_endpoint: `https://localhost:${mock_port}`,
  cosmosdb_account_key: "dummy key",
  cosmosdb_reject_unauthorized: false,
  cosmosdb_use_keyvault: false,
};
const mock_azure_storage_account: Config_models.azure_storage_account = {
  storage_account_name: "devstoreaccount1",
  storage_account_container: `devcontainer${date_string}`,
  storage_account_key:
    "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==",
  storage_account_delimiter: "/",
  storage_account_prefix: `${date_string}/`,
  storage_account_suffix: "",
  storage_account_protocol: "http",
  storage_account_connectionstring_suffix:
    "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;",
  storage_account_use_keyvault: false,
  storage_account_use_datafactory_format: false,
};

const server = cosmosdb_server();

const argv: string[] = [
  "node",
  "cosmocli",
  "backup",
  "azure-storage-account",
  "--cosmosdb-account-endpoint",
  mock_cosmosdb.cosmosdb_account_endpoint,
  "--cosmosdb-account-key",
  mock_cosmosdb.cosmosdb_account_key,
  "--cosmosdb-reject-unauthorized",
  mock_cosmosdb.cosmosdb_reject_unauthorized.toString(),
  "--storage-account-name",
  mock_azure_storage_account.storage_account_name,
  "--storage-account-container",
  mock_azure_storage_account.storage_account_container,
  "--storage-account-key",
  mock_azure_storage_account.storage_account_key,
  "--storage-account-protocol",
  mock_azure_storage_account.storage_account_protocol,
  "--storage-account-connectionstring-suffix",
  mock_azure_storage_account.storage_account_connectionstring_suffix,
  "--storage-account-prefix",
  mock_azure_storage_account.storage_account_prefix,
];

process.argv = argv;
logger.info = jest.fn();

const cosmosdb_client = get_cosmosdb_client(mock_cosmosdb);

const mock_item1: ItemDefinition = {
  id: "1",
  foo: "bar",
};
const mock_item2: ItemDefinition = {
  id: "2",
  foo: "bar",
};
const mock_item3: ItemDefinition = {
  id: "3",
  foo: "bar",
};
export const mock_items: ItemDefinition[] = [
  mock_item1,
  mock_item2,
  mock_item3,
];

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

beforeAll(async (done) => {
  await start_cosmosdb_server(server, mock_port)
    .then(() => container_client.create())
    .then(() => {})
    .then(done);
});

afterAll(async (done) => {
  await stop_cosmosdb_server(server)
    .then(() => container_client.delete())
    .then(() => {})
    .then(done);
});

describe("end-to-end backup azure-storage-account one db one container", () => {
  it("should create one file with json array with three items", (done) => {
    expect.assertions(1);
    remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container1",
          mock_items
        )
      )
      .then(() => Args_model.from_args(process.argv.slice(2)))
      .then(Commands_model.from_args)
      .then(Cli_client.client)
      .then(() => {
        const block_blob_client = container_client.getBlockBlobClient(
          `${date_string}/db1/container1`
        );
        return block_blob_client.download(0);
      })
      .then((stream) => {
        return stream_to_string(
          stream.readableStreamBody as NodeJS.ReadableStream
        ).then((output) => {
          return expect(JSON.parse(output).length).toEqual(3);
        });
      })
      .then(done);
  });
});
