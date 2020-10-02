import { ItemDefinition } from "@azure/cosmos";
import cosmosdb_server from "@zeit/cosmosdb-server";

import * as Cosmosdb_client from "./cosmosdb";
import logger from "./logger";
import * as Config_models from "../models/config";

import {
  get_cosmosdb_client,
  start_cosmosdb_server,
  create_cosmosdb_db_container_items,
  stop_cosmosdb_server,
  remove_all_cosmosdb_databases,
} from "../__tests__/helpers";

logger.info = jest.fn();

const mock_port = 3000;
const mock_cosmosdb: Config_models.cosmosdb = {
  cosmosdb_account_endpoint: `https://localhost:${mock_port}`,
  cosmosdb_account_key: "dummy key",
  cosmosdb_reject_unauthorized: false,
  cosmosdb_use_keyvault: false,
};

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

export const server = cosmosdb_server();

beforeAll(async (done) => {
  await start_cosmosdb_server(server, mock_port).then(done);
});

afterAll(async (done) => {
  await stop_cosmosdb_server(server).then(done);
});

describe("one db", () => {
  it("should return items from one container", (done) => {
    expect.assertions(2);
    remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container1",
          mock_items
        )
      )
      .then(() =>
        Cosmosdb_client.get_all_items(mock_cosmosdb)
          .then((items) => {
            expect(items.length).toEqual(1);
            expect(items[0].items.length).toEqual(3);
          })
          .then(done)
      );
  });
});

describe("two dbs", () => {
  it("should return items from two containers", (done) => {
    expect.assertions(3);

    remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container1",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db2",
          "container1",
          mock_items
        )
      )
      .then(() =>
        Cosmosdb_client.get_all_items(mock_cosmosdb)
          .then((items) => {
            expect(items.length).toEqual(2);
            expect(items[0].items.length).toEqual(3);
            expect(items[1].items.length).toEqual(3);
          })
          .then(done)
      );
  });
});

describe("three dbs four containers", () => {
  it("should return items from four containers", (done) => {
    expect.assertions(5);
    remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container1",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container2",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db2",
          "container1",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db3",
          "container1",
          mock_items
        )
      )
      .then(() =>
        Cosmosdb_client.get_all_items(mock_cosmosdb)
          .then((items) => {
            expect(items.length).toEqual(4);
            expect(items[0].items.length).toEqual(3);
            expect(items[1].items.length).toEqual(3);
            expect(items[2].items.length).toEqual(3);
            expect(items[3].items.length).toEqual(3);
          })
          .then(done)
      );
  });
});

describe("failing test", () => {
  it("should fail when using wrong uri", (done) => {
    expect.assertions(1);

    expect(
      Cosmosdb_client.get_all_items({
        ...mock_cosmosdb,
        cosmosdb_account_endpoint: "https://localhost:1337",
      })
    )
      .rejects.toThrow()
      .then(done);
  });
});
