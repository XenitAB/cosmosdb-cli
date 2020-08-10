import * as Config_models from "./config";
import logger from "../clients/logger";

const mock_cosmosdb: Config_models.cosmosdb = {
  cosmosdb_account_endpoint: `https://localhost:1234`,
  cosmosdb_account_key: "dummy key",
  cosmosdb_reject_unauthorized: true,
  cosmosdb_use_keyvault: false,
};
const mock_azure_storage_account: Config_models.azure_storage_account = {
  storage_account_name: "devstoreaccount1",
  storage_account_container: `devcontainer1234`,
  storage_account_key:
    "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==",
  storage_account_delimiter: "/",
  storage_account_prefix: `1234/`,
  storage_account_suffix: "",
  storage_account_protocol: "http",
  storage_account_connectionstring_suffix:
    "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;",
  storage_account_use_keyvault: false,
};
const mock_filesystem: Config_models.filesystem = {
  filesystem_path: "/tmp/",
  filesystem_prefix: `1234/`,
  filesystem_suffix: "",
  filesystem_delimiter: "/",
};

const argv_storage_account: string[] = [
  "node",
  "cosmosdb-cli",
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

const argv_storage_account_keyvault: string[] = [
  "node",
  "cosmosdb-cli",
  "backup",
  "azure-storage-account",
  "--keyvault-name",
  "abc123",
  "--cosmosdb-use-keyvault",
  "true",
  "--storage-account-use-keyvault",
  "true",
  "--storage-account-container",
  mock_azure_storage_account.storage_account_container,
  "--storage-account-protocol",
  mock_azure_storage_account.storage_account_protocol,
  "--storage-account-connectionstring-suffix",
  mock_azure_storage_account.storage_account_connectionstring_suffix,
  "--storage-account-prefix",
  mock_azure_storage_account.storage_account_prefix,
];

const argv_filesystem: string[] = [
  "node",
  "cosmosdb-cli",
  "backup",
  "filesystem",
  "--cosmosdb-account-endpoint",
  mock_cosmosdb.cosmosdb_account_endpoint,
  "--cosmosdb-account-key",
  mock_cosmosdb.cosmosdb_account_key,
  "--cosmosdb-reject-unauthorized",
  mock_cosmosdb.cosmosdb_reject_unauthorized.toString(),
  "--filesystem-path",
  mock_filesystem.filesystem_path,
  "--filesystem-prefix",
  mock_filesystem.filesystem_prefix,
];

const argv_filesystem_keyvault: string[] = [
  "node",
  "cosmosdb-cli",
  "backup",
  "filesystem",
  "--keyvault-name",
  "abc123",
  "--cosmosdb-use-keyvault",
  "true",
  "--filesystem-path",
  mock_filesystem.filesystem_path,
  "--filesystem-prefix",
  mock_filesystem.filesystem_prefix,
];

logger.info = jest.fn();

import * as Keyvault_client from "../clients/keyvault";
jest.mock("../clients/keyvault", () => ({
  get_keyvault_secret: jest.fn(
    (_keyvault_name: string, secret_name: string) =>
      new Promise((resolve, reject) => {
        switch (secret_name) {
          case "CosmosDbEndpoint":
            resolve(mock_cosmosdb.cosmosdb_account_endpoint);
          case "CosmosDbKey":
            resolve(mock_cosmosdb.cosmosdb_account_key);
          case "StorageAccountName":
            resolve(mock_azure_storage_account.storage_account_name);
          case "StorageAccountKey":
            resolve(mock_azure_storage_account.storage_account_key);
          default:
            reject("shouldn't be here");
        }
      })
  ),
}));

describe("config models test", () => {
  const mock_get_keyvault_secret = jest.spyOn(
    Keyvault_client,
    "get_keyvault_secret"
  );

  beforeEach((done) => {
    mock_get_keyvault_secret.mockClear();
    done();
  });

  it("azure storage account should return config", (done) => {
    expect.assertions(1);
    process.argv = argv_storage_account;
    Config_models.get_azure_storage_account_config()
      .then((config) => expect(config).toEqual(mock_azure_storage_account))
      .then(done);
  });

  it("filesystem should return config", (done) => {
    expect.assertions(1);
    process.argv = argv_filesystem;
    Config_models.get_filesystem_config()
      .then((config) => expect(config).toEqual(mock_filesystem))
      .then(done);
  });

  it("filesystem_keyvault should return config", (done) => {
    expect.assertions(2);
    process.argv = argv_filesystem_keyvault;
    Config_models.get_cosmosdb_config()
      .then((config) => {
        expect(config).toEqual({
          ...mock_cosmosdb,
          cosmosdb_use_keyvault: true,
        });
        expect(mock_get_keyvault_secret).toHaveBeenCalledTimes(2);
      })
      .then(done);
  });

  it("storage_account_keyvault should return config", (done) => {
    expect.assertions(2);
    process.argv = argv_storage_account_keyvault;
    Config_models.get_azure_storage_account_config()
      .then((config) => {
        expect(config).toEqual({
          ...mock_azure_storage_account,
          storage_account_use_keyvault: true,
        });
        expect(mock_get_keyvault_secret).toHaveBeenCalledTimes(2);
      })
      .then(done);
  });
});
