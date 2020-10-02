import https from "https";
import { CosmosClient } from "@azure/cosmos";

import logger from "./logger";

import * as Cosmosdb_models from "../models/cosmosdb";
import * as Config_models from "../models/config";

const client = (cosmosdb: Config_models.cosmosdb): Promise<CosmosClient> => {
  const endpoint = cosmosdb.cosmosdb_account_endpoint;
  const key = cosmosdb.cosmosdb_account_key;
  const reject_unauthorized = cosmosdb.cosmosdb_reject_unauthorized;
  return new Promise((resolve) => {
    const cosmosdb_client = new CosmosClient({
      endpoint: endpoint,
      key: key,
      agent: new https.Agent({ rejectUnauthorized: reject_unauthorized }),
    });
    resolve(cosmosdb_client);
  });
};

const get_databases = (
  client: CosmosClient,
  cosmosdb: Config_models.cosmosdb
): Promise<Cosmosdb_models.databases> => {
  return client.databases
    .readAll()
    .fetchAll()
    .then((databases) => {
      return databases.resources
        .map((database) => {
          if (database.id == null) {
            return null;
          }

          return {
            account_name: cosmosdb.cosmosdb_account_endpoint
              .replace("http://", "")
              .replace("https://", "")
              .replace(/:.*/g, "")
              .split(".")[0],
            db_id: database.id,
          };
        })
        .filter((x) => x != null) as Cosmosdb_models.databases;
    })
    .catch((e) => {
      throw new Error(e);
    });
};

const get_containers_by_db = (
  client: CosmosClient,
  database: Cosmosdb_models.database
): Promise<Cosmosdb_models.containers> => {
  return client
    .database(database.db_id)
    .containers.readAll()
    .fetchAll()
    .then((containers) => {
      return containers.resources.map((container) => {
        return {
          ...database,
          container_id: container.id,
        };
      });
    });
};

const get_containers_by_dbs = (
  client: CosmosClient,
  databases: Cosmosdb_models.databases,
  prev_containers?: Cosmosdb_models.containers
): Promise<Cosmosdb_models.containers> => {
  const [database, ...rest] = databases;
  if (rest.length === 0) {
    return get_containers_by_db(client, database).then((containers) => {
      if (prev_containers) {
        return containers.concat(prev_containers);
      } else {
        return containers;
      }
    });
  } else {
    return get_containers_by_db(client, database).then((containers) => {
      if (prev_containers) {
        return get_containers_by_dbs(
          client,
          rest,
          containers.concat(prev_containers)
        );
      } else {
        return get_containers_by_dbs(client, rest, containers);
      }
    });
  }
};

const get_items_by_container = (
  client: CosmosClient,
  container: Cosmosdb_models.container
): Promise<Cosmosdb_models.items_by_container> => {
  logger.info({
    location: "Cosmosdb.get_items_by_container",
    msg: "Fetching items",
    container: container,
  });
  return client
    .database(container.db_id)
    .container(container.container_id)
    .items.readAll({ bufferItems: true })
    .fetchAll()
    .then((items) => {
      logger.info({
        location: "Cosmosdb.get_items_by_container",
        msg: "Sucessfully fetched items",
        container: container,
      });
      return {
        ...container,
        items: items.resources,
      };
    })
    .catch((error) => {
      logger.error({
        location: "Cosmosdb.get_items_by_container",
        msg: "Failed to fetch items",
        container,
        error,
      });
      return {
        ...container,
        items: [],
      };
    });
};

const get_items_by_containers = (
  client: CosmosClient,
  containers: Cosmosdb_models.containers,
  prev_items?: Cosmosdb_models.items_by_containers
): Promise<Cosmosdb_models.items_by_containers> => {
  const [container, ...rest] = containers;
  if (rest.length === 0) {
    return get_items_by_container(client, container).then((items) => {
      if (prev_items) {
        return prev_items.concat(items);
      } else {
        return [items];
      }
    });
  } else {
    return get_items_by_container(client, container).then((items) => {
      if (prev_items) {
        return get_items_by_containers(client, rest, prev_items.concat(items));
      } else {
        return get_items_by_containers(client, rest, [items]);
      }
    });
  }
};

export const get_all_items = (
  cosmosdb: Config_models.cosmosdb
): Promise<Cosmosdb_models.items_by_containers> => {
  return client(cosmosdb).then((client) =>
    get_databases(client, cosmosdb)
      .then((databases) => get_containers_by_dbs(client, databases))
      .then((containers) => get_items_by_containers(client, containers))
  );
};
