import { CosmosClient } from "@azure/cosmos";
import * as Cosmosdb_models from "../models/cosmosdb";

export const client = (
  endpoint: string,
  key: string
): Promise<CosmosClient> => {
  return new Promise((resolve, reject) => {
    try {
      const cosmosdb_client = new CosmosClient({
        endpoint: endpoint,
        key: key,
      });
      resolve(cosmosdb_client);
    } catch (e) {
      reject(e);
    }
  });
};

const get_databases = (
  client: CosmosClient
): Promise<Cosmosdb_models.databases> => {
  return client.databases
    .readAll()
    .fetchAll()
    .then((databases) => {
      return databases.resources.map((database) => {
        return {
          client: client,
          db_id: database.id,
        };
      });
    });
};

const get_containers_by_db = (
  database: Cosmosdb_models.database
): Promise<Cosmosdb_models.containers> => {
  return database.client
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
  databases: Cosmosdb_models.databases,
  prev_containers?: Cosmosdb_models.containers
): Promise<Cosmosdb_models.containers> => {
  const [database, ...rest] = databases;
  if (rest.length === 0) {
    return get_containers_by_db(database).then((containers) => {
      if (prev_containers) {
        return containers.concat(prev_containers);
      } else {
        return containers;
      }
    });
  } else {
    return get_containers_by_db(database).then((containers) => {
      if (prev_containers) {
        return get_containers_by_dbs(rest, containers.concat(prev_containers));
      } else {
        return get_containers_by_dbs(rest, containers);
      }
    });
  }
};

const get_items_by_container = (
  container: Cosmosdb_models.container
): Promise<Cosmosdb_models.items_by_container> => {
  return container.client
    .database(container.db_id)
    .container(container.container_id)
    .items.readAll()
    .fetchAll()
    .then((items) => {
      return {
        ...container,
        item_count: items.resources.length,
        items: items.resources.map((item) => item),
      };
    });
};

const get_items_by_containers = (
  containers: Cosmosdb_models.containers,
  prev_items?: Cosmosdb_models.items_by_containers
): Promise<Cosmosdb_models.items_by_containers> => {
  const [container, ...rest] = containers;
  if (rest.length === 0) {
    return get_items_by_container(container).then((items) => {
      if (prev_items) {
        return prev_items.concat(items);
      } else {
        return [items];
      }
    });
  } else {
    return get_items_by_container(container).then((items) => {
      if (prev_items) {
        return get_items_by_containers(rest, prev_items.concat(items));
      } else {
        return get_items_by_containers(rest, [items]);
      }
    });
  }
};

export const get_all_items = (
  client: CosmosClient
): Promise<Cosmosdb_models.items_by_containers> => {
  return get_databases(client)
    .then(get_containers_by_dbs)
    .then(get_items_by_containers);
};
