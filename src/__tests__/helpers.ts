/* istanbul ignore file */
import {
  CosmosClient,
  Container,
  ItemDefinition,
  DatabaseDefinition,
  Resource,
} from "@azure/cosmos";
import { Server } from "http";
import https from "https";
import * as Config_models from "../models/config";

// storage account
export const stream_to_string = (
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

// cosmosdb
export const get_cosmosdb_client = (mock_cosmosdb: Config_models.cosmosdb) => {
  return new CosmosClient({
    endpoint: mock_cosmosdb.cosmosdb_account_endpoint,
    key: mock_cosmosdb.cosmosdb_account_key,
    agent: new https.Agent({
      rejectUnauthorized: mock_cosmosdb.cosmosdb_reject_unauthorized,
    }),
  });
};

export const start_cosmosdb_server = (
  cosmosdb_server: Server,
  port: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      cosmosdb_server.listen(port);
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

export const remove_all_cosmosdb_databases = (
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
