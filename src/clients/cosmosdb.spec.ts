import * as Cosmosdb_client from "./cosmosdb";
import * as Config_models from "../models/config";
import cosmosdb_server from "@zeit/cosmosdb-server";
import { CosmosClient, Container, ItemDefinition } from "@azure/cosmos";
import { Server } from "http";
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

describe("cosmosdb tests with one db", () => {
  const server = cosmosdb_server();
  beforeAll((done) => {
    start_cosmosdb_server(server)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container1",
          mock_items
        )
      )
      .then(done)
      .catch((e) => {
        console.error({
          location: "Cosmosdb_spec.beforeAll",
          error: e,
        });
        throw new Error(e);
      });
  });

  afterAll((done) => {
    stop_cosmosdb_server(server)
      .then(() => {})
      .then(done)
      .catch((e) => {
        console.error({
          location: "Cosmosdb_spec.afterAll",
          error: e,
        });
        throw new Error(e);
      });
  });

  it("should return items from one container", (done) => {
    expect.assertions(2);

    Cosmosdb_client.get_all_items(mock_cosmosdb)
      .then((items) => {
        expect(items.length).toEqual(1);
        expect(items[0].items.length).toEqual(3);
      })
      .then(done);
  });

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
const start_cosmosdb_server = (cosmosdb_server: Server): Promise<Server> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(cosmosdb_server.listen(3000));
    } catch (e) {
      reject(e);
    }
  });
};

const stop_cosmosdb_server = (cosmosdb_server: Server): Promise<Server> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(cosmosdb_server.close());
    } catch (e) {
      reject(e);
    }
  });
};

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
    .create({
      id: database,
    })
    .then((database) => database.database.containers.create({ id: container }))
    .then((container) => create_cosmosdb_items(container.container, items));
};
