//common
import JsonStreamStringify from "json-stream-stringify";

import * as Backup_client from "./backup";
import * as Config_models from "../models/config";
import * as Cosmosdb_models from "../models/cosmosdb";

const mock_items_by_container1: Cosmosdb_models.items_by_container = {
  account_name: "account",
  db_id: "db_1",
  container_id: "container_1",
  items: [
    {
      id: "item_1",
      foo: "bar",
      _rid: "3RZzAONonFcBAAAAAAAAAA==",
      _self: "dbs/3RZzAA==/colls/3RZzAONonFc=/docs/3RZzAONonFcBAAAAAAAAAA==/",
      _etag: '"6700d676-0000-0d00-0000-5f0b50920000"',
      _attachments: "attachments/",
      _ts: 1594577042,
    },
  ],
};

const mock_items_by_container2: Cosmosdb_models.items_by_container = {
  account_name: "account",
  db_id: "db_2",
  container_id: "container_2",
  items: [
    {
      id: "item_2",
      foo: "bar",
      _rid: "LLVPAIjzFDoBAAAAAAAAAA==",
      _self: "dbs/LLVPAA==/colls/LLVPAIjzFDo=/docs/LLVPAIjzFDoBAAAAAAAAAA==/",
      _etag: '"a200de47-0000-0d00-0000-5f0b50a30000"',
      _attachments: "attachments/",
      _ts: 1594577059,
    },
  ],
};

const mock_items_by_container3: Cosmosdb_models.items_by_container = {
  account_name: "account",
  db_id: "db_3",
  container_id: "container_3",
  items: [
    {
      id: "foo",
      foo: "bar",
      _rid: "XTxWAMjAZEEBAAAAAAAAAA==",
      _self: "dbs/XTxWAA==/colls/XTxWAMjAZEE=/docs/XTxWAMjAZEEBAAAAAAAAAA==/",
      _etag: '"d3000c52-0000-0d00-0000-5f1746800000"',
      _attachments: "attachments/",
      _ts: 1595360896,
    },
  ],
};

const mock_items_by_containers = [
  mock_items_by_container1,
  mock_items_by_container2,
  mock_items_by_container3,
];

// storage account
import * as Storageaccount_client from "./storageaccount";
jest.mock("./storageaccount", () => ({
  save_item: jest.fn(() => new Promise((resolve) => resolve({}))),
}));

const mock_azure_storage_account: Config_models.azure_storage_account = {
  storage_account_name: "name",
  storage_account_container: "container",
  storage_account_key: "key",
  storage_account_delimiter: "/",
  storage_account_prefix: `${Date.now().toString()}/`,
  storage_account_suffix: "",
  storage_account_protocol: "https",
  storage_account_connectionstring_suffix: "EndpointSuffix=core.windows.net;",
  storage_account_use_keyvault: false,
  storage_account_use_datafactory_format: false,
};

const mock_azure_storage_account2: Config_models.azure_storage_account = {
  storage_account_name: "name",
  storage_account_container: "container",
  storage_account_key: "key",
  storage_account_delimiter: "/",
  storage_account_prefix: `${Date.now().toString()}/`,
  storage_account_suffix: "",
  storage_account_protocol: "https",
  storage_account_connectionstring_suffix: "EndpointSuffix=core.windows.net;",
  storage_account_use_keyvault: false,
  storage_account_use_datafactory_format: false,
};

describe("backup tests - cosmosdb to azure storage account", () => {
  const mock_save_item = jest.spyOn(Storageaccount_client, "save_item");

  beforeEach((done) => {
    mock_save_item.mockClear();
    done();
  });

  it("should call save_item 1 time", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_storage_account_blob(
      mock_azure_storage_account,
      [mock_items_by_container1]
    )
      .then(() => expect(mock_save_item).toHaveBeenCalledTimes(1))
      .then(done);
  });
  it("should call save_item 3 times", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_storage_account_blob(
      mock_azure_storage_account,
      mock_items_by_containers
    )
      .then(() => expect(mock_save_item).toHaveBeenCalledTimes(3))
      .then(done);
  });
  it("should call save_item with mock_items_by_container1", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_storage_account_blob(
      mock_azure_storage_account,
      [mock_items_by_container1]
    )
      .then(() =>
        expect(mock_save_item).toHaveBeenCalledWith(
          new JsonStreamStringify(mock_items_by_container1.items),
          `${mock_azure_storage_account.storage_account_prefix}${mock_items_by_container1.db_id}${mock_azure_storage_account.storage_account_delimiter}${mock_items_by_container1.container_id}${mock_azure_storage_account.storage_account_suffix}`,
          mock_azure_storage_account
        )
      )
      .then(done);
  });
  it("should call save_item with mock_items_by_container3 last", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_storage_account_blob(
      mock_azure_storage_account,
      mock_items_by_containers
    )
      .then(() =>
        expect(mock_save_item).toHaveBeenLastCalledWith(
          new JsonStreamStringify(mock_items_by_container3.items),
          `${mock_azure_storage_account.storage_account_prefix}${mock_items_by_container3.db_id}${mock_azure_storage_account.storage_account_delimiter}${mock_items_by_container3.container_id}${mock_azure_storage_account.storage_account_suffix}`,
          mock_azure_storage_account
        )
      )
      .then(done);
  });
});

// filesystem
import * as Fs_client from "./fs";
jest.mock("./fs", () => ({
  save_item: jest.fn(() => new Promise((resolve) => resolve({}))),
}));

const mock_filesystem: Config_models.filesystem = {
  filesystem_path: "path",
  filesystem_delimiter: "/",
  filesystem_prefix: `${Date.now().toString()}/`,
  filesystem_suffix: "",
};

describe("backup tests - cosmosdb to filesystem", () => {
  const mock_save_item = jest.spyOn(Fs_client, "save_item");

  beforeEach((done) => {
    mock_save_item.mockClear();
    done();
  });

  it("should call save_item 1 time", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_filesystem(mock_filesystem, [
      mock_items_by_container1,
    ])
      .then(() => expect(mock_save_item).toHaveBeenCalledTimes(1))
      .then(done);
  });
  it("should call save_item 3 times", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_filesystem(
      mock_filesystem,
      mock_items_by_containers
    )
      .then(() => expect(mock_save_item).toHaveBeenCalledTimes(3))
      .then(done);
  });
  it("should call save_item with mock_items_by_container1", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_filesystem(mock_filesystem, [
      mock_items_by_container1,
    ])
      .then(() =>
        expect(mock_save_item).toHaveBeenCalledWith(
          new JsonStreamStringify(mock_items_by_container1.items),
          `${mock_filesystem.filesystem_path}${mock_filesystem.filesystem_prefix}${mock_items_by_container1.db_id}${mock_filesystem.filesystem_delimiter}${mock_items_by_container1.container_id}${mock_filesystem.filesystem_suffix}`
        )
      )
      .then(done);
  });
  it("should call save_item with mock_items_by_container3 last", (done) => {
    expect.assertions(1);
    Backup_client.backup_cosmosdb_containers_to_filesystem(
      mock_filesystem,
      mock_items_by_containers
    )
      .then(() =>
        expect(mock_save_item).toHaveBeenLastCalledWith(
          new JsonStreamStringify(mock_items_by_container3.items),
          `${mock_filesystem.filesystem_path}${mock_filesystem.filesystem_prefix}${mock_items_by_container3.db_id}${mock_filesystem.filesystem_delimiter}${mock_items_by_container3.container_id}${mock_filesystem.filesystem_suffix}`
        )
      )
      .then(done);
  });
});
