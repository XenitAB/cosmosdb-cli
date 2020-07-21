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
  return new Promise((resolve, reject) => {
    try {
      client.databases
        .readAll()
        .fetchAll()
        .then((databases) => {
          return databases.resources.map((database) => {
            return {
              client: client,
              db_id: database.id,
            };
          });
        })
        .then(resolve);
    } catch (e) {
      reject(e);
    }
  });
};

const get_containers_by_db = (
  database: Cosmosdb_models.database
): Promise<Cosmosdb_models.containers> => {
  return new Promise((resolve, reject) => {
    database.client
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
      })
      .then(resolve)
      .catch(reject);
  });
};

const get_containers_by_dbs = (
  databases: Cosmosdb_models.databases,
  prev_containers?: Cosmosdb_models.containers
): Promise<Cosmosdb_models.containers> => {
  return new Promise((resolve, reject) => {
    if (databases.length === 1) {
      get_containers_by_db(databases[0])
        .then((containers) => {
          databases.pop();
          if (prev_containers) {
            resolve(containers.concat(prev_containers));
          } else {
            resolve(containers);
          }
        })
        .catch(reject);
    } else {
      get_containers_by_db(databases[databases.length - 1]).then(
        (containers) => {
          databases.pop();
          if (prev_containers) {
            get_containers_by_dbs(databases, containers.concat(prev_containers))
              .then(resolve)
              .catch(reject);
          } else {
            get_containers_by_dbs(databases, containers)
              .then(resolve)
              .catch(reject);
          }
        }
      );
    }
  });
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
    })
    .catch((e) => e);
};

const get_items_by_containers = (
  containers: Cosmosdb_models.containers,
  prev_items?: Cosmosdb_models.items_by_containers
): Promise<Cosmosdb_models.items_by_containers> => {
  return new Promise((resolve, reject) => {
    if (containers.length === 1) {
      get_items_by_container(containers[0])
        .then((items) => {
          containers.pop();
          if (prev_items) {
            resolve(prev_items.concat(items));
          } else {
            resolve([items]);
          }
        })
        .catch(reject);
    } else {
      get_items_by_container(containers[containers.length - 1]).then(
        (items) => {
          containers.pop();
          if (prev_items) {
            get_items_by_containers(containers, prev_items.concat(items))
              .then(resolve)
              .catch(reject);
          } else {
            get_items_by_containers(containers, [items])
              .then(resolve)
              .catch(reject);
          }
        }
      );
    }
  });
};

export const get_all_items = (
  client: CosmosClient
): Promise<Cosmosdb_models.items_by_containers> => {
  return new Promise((resolve, reject) => {
    try {
      get_databases(client)
        .then(get_containers_by_dbs)
        .then(get_items_by_containers)
        .then(resolve);
    } catch (e) {
      reject(e);
    }
  });
};
