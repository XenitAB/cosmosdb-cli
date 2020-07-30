import * as Cosmosdb_client from "./cosmosdb";
import * as Config_models from "../models/config";
import { CosmosClient, Container, ItemDefinition } from "@azure/cosmos";
import https from "https";

const mock_cosmosdb: Config_models.cosmosdb = {
  cosmosdb_account_endpoint: "https://localhost:3000",
  cosmosdb_account_key: "dummy key",
  cosmosdb_reject_unauthorized: false,
};

const cosmosdb_client = new CosmosClient({
  endpoint: mock_cosmosdb.cosmosdb_account_endpoint,
  key: mock_cosmosdb.cosmosdb_account_key,
  agent: new https.Agent({
    rejectUnauthorized: mock_cosmosdb.cosmosdb_reject_unauthorized,
  }),
});

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
const mock_items: ItemDefinition[] = [mock_item1, mock_item2, mock_item3];

describe("cosmosdb tests", () => {
  describe("one db", () => {
    it("should return items from one container", (done) => {
      expect.assertions(2);

      create_cosmosdb_db_container_items(
        cosmosdb_client,
        "db1",
        "container1",
        mock_items
      ).then(() =>
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

      create_cosmosdb_db_container_items(
        cosmosdb_client,
        "db2",
        "container2",
        mock_items
      ).then(() =>
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

  describe("three dbs", () => {
    it("should return items from three containers", (done) => {
      expect.assertions(4);

      create_cosmosdb_db_container_items(
        cosmosdb_client,
        "db3",
        "container3",
        mock_items
      ).then(() =>
        Cosmosdb_client.get_all_items(mock_cosmosdb)
          .then((items) => {
            expect(items.length).toEqual(3);
            expect(items[0].items.length).toEqual(3);
            expect(items[1].items.length).toEqual(3);
            expect(items[2].items.length).toEqual(3);
          })
          .then(done)
      );
    });
  });

  describe("multiple containers", () => {
    it("should return items from four containers", (done) => {
      expect.assertions(5);

      create_cosmosdb_db_container_items(
        cosmosdb_client,
        "db1",
        "container4",
        mock_items
      ).then(() =>
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
});

const create_cosmosdb_item = (
  container: Container,
  item: ItemDefinition
): Promise<void> => {
  return container.items.create(item).then(() => {});
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

const create_cosmosdb_db_container_items = (
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
        location: "Cosmosdb_spec.create_cosmosdb_db_container_items",
        error: e,
      });
      throw new Error(e);
    });
};
