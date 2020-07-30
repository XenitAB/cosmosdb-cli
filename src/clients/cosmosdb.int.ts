import * as Cosmosdb_client from "./cosmosdb";
import * as Config_models from "../models/config";
import {
  CosmosClient,
  Container,
  ItemDefinition,
  DatabaseDefinition,
  Resource,
} from "@azure/cosmos";
import https from "https";
import cosmosdb_server from "@zeit/cosmosdb-server";
import { Server } from "http";

export const mock_cosmosdb: Config_models.cosmosdb = {
  cosmosdb_account_endpoint: "https://localhost:3000",
  cosmosdb_account_key: "dummy key",
  cosmosdb_reject_unauthorized: false,
};

export const get_cosmosdb_client = (mock_cosmosdb: Config_models.cosmosdb) =>
  new CosmosClient({
    endpoint: mock_cosmosdb.cosmosdb_account_endpoint,
    key: mock_cosmosdb.cosmosdb_account_key,
    agent: new https.Agent({
      rejectUnauthorized: mock_cosmosdb.cosmosdb_reject_unauthorized,
    }),
  });

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
  await start_cosmosdb_server(server).then(done);
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

// helper functions
export const start_cosmosdb_server = (
  cosmosdb_server: Server
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      cosmosdb_server.listen(3000);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const stop_cosmosdb_server = (
  cosmosdb_server: Server
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      cosmosdb_server.close();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const create_cosmosdb_item = (
  container: Container,
  item: ItemDefinition,
  retry_counter?: number
): Promise<void> => {
  return container.items
    .create(item)
    .then(() => {})
    .catch((e) => {
      // Added retries since @zeit/cosmosdb-server seems to fail sometimes
      if (retry_counter) {
        if (retry_counter > 5) {
          console.error({
            location: "Cosmosdb_int.create_cosmosdb_item",
            container,
            item,
            retry_counter,
            error: e,
          });
          throw new Error(e);
        } else {
          create_cosmosdb_item(container, item, retry_counter + 1);
        }
      } else {
        create_cosmosdb_item(container, item, 1);
      }
    });
};

const create_cosmosdb_items = (
  container: Container,
  items: ItemDefinition[]
): Promise<void> => {
  const [item, ...rest] = items;
  if (rest.length === 0) {
    return create_cosmosdb_item(container, item);
  } else {
    return create_cosmosdb_item(container, item).then(() =>
      create_cosmosdb_items(container, rest)
    );
  }
};

export const create_cosmosdb_db_container_items = (
  cosmosdb_client: CosmosClient,
  database: string,
  container: string,
  items: ItemDefinition[]
): Promise<void> => {
  return cosmosdb_client.databases
    .createIfNotExists({
      id: database,
    })
    .then((database) =>
      database.database.containers.createIfNotExists({ id: container })
    )
    .then((container) => create_cosmosdb_items(container.container, items))
    .catch((e) => {
      console.error({
        location: "Cosmosdb_int.create_cosmosdb_db_container_items",
        error: e,
      });
      throw new Error(e);
    });
};

export const remove_cosmosdb_database = (
  cosmosdb_client: CosmosClient,
  database: DatabaseDefinition & Resource
): Promise<void> => {
  return new Promise((resolve) =>
    resolve(
      cosmosdb_client
        .database(database.id)
        .delete()
        .then(() => {})
        .catch((e) => {
          console.error({
            location: "Cosmosdb_int.remove_cosmosdb_database",
            error: e,
          });
          throw new Error(e);
        })
    )
  );
};

const remove_all_cosmosdb_databases = (
  cosmosdb_client: CosmosClient
): Promise<void> => {
  return cosmosdb_client.databases
    .readAll()
    .fetchAll()
    .then((databases) => {
      if (databases.resources.length !== 0) {
        const [database, ...rest] = databases.resources;
        if (rest.length === 0) {
          remove_cosmosdb_database(cosmosdb_client, database);
        } else {
          remove_cosmosdb_database(cosmosdb_client, database).then(() =>
            remove_all_cosmosdb_databases(cosmosdb_client)
          );
        }
      }
    })
    .catch(() => {});
};
