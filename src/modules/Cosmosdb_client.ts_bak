import logger from "./Logger";
import {
  CosmosClient,
  FeedResponse,
  DatabaseDefinition,
  ContainerDefinition,
  ItemDefinition,
  Resource,
} from "@azure/cosmos";

export const client = (endpoint: string, key: string): CosmosClient => {
  try {
    const cosmosdb_client = new CosmosClient({
      endpoint: endpoint,
      key: key,
    });
    return cosmosdb_client;
  } catch (e) {
    logger.error({
      module: "Cosmosdb_client.client",
      error: e,
    });
    process.exit(1);
  }
};

const get_databases = async (
  client: CosmosClient
): Promise<FeedResponse<DatabaseDefinition & Resource>> => {
  try {
    return await client.databases.readAll().fetchAll();
  } catch (e) {
    logger.error({
      module: "Cosmosdb_client.get_databases",
      error: e,
    });
    process.exit(1);
  }
};

type container_by_db = {
  response: FeedResponse<ContainerDefinition & Resource>;
  db_id: string;
};

const get_containers_by_db = async (
  client: CosmosClient,
  db_id: string
): Promise<container_by_db> => {
  try {
    return {
      response: await client.database(db_id).containers.readAll().fetchAll(),
      db_id: db_id,
    };
  } catch (e) {
    logger.error({
      module: "Cosmosdb_client.get_containers_by_db",
      error: e,
    });
    process.exit(1);
  }
};

type container_id = {
  db_id: string;
  container_id: string;
};

type container_ids = Array<container_id>;

const get_container_ids = (
  response: FeedResponse<ContainerDefinition & Resource>,
  db_id: string
): container_ids => {
  try {
    return response.resources.map((container) => {
      return {
        db_id: db_id as string,
        container_id: container.id as string,
      };
    });
  } catch (e) {
    logger.error({
      module: "Cosmosdb_client.get_container_ids",
      error: e,
    });
    process.exit(1);
  }
};

type items_by_container_and_db = {
  response: FeedResponse<ItemDefinition>;
  db_id: string;
  container_id: string;
};

const get_items_by_container_and_db = async (
  client: CosmosClient,
  db_id: string,
  container_id: string
): Promise<items_by_container_and_db> => {
  try {
    return {
      response: await client
        .database(db_id)
        .container(container_id)
        .items.readAll()
        .fetchAll(),
      db_id: db_id,
      container_id: container_id,
    };
  } catch (e) {
    logger.error({
      module: "Cosmosdb_client.get_items_by_container_and_db",
      error: e,
    });
    process.exit(1);
  }
};

export type items = Array<{
  db_id: string;
  container_id: string;
  item_count: number;
  items: ItemDefinition[];
}>;

export const get_items = async (client: CosmosClient): Promise<items> => {
  try {
    const cosmosdb_databases = await get_databases(client);
    const cosmosdb_containers = await Promise.all(
      cosmosdb_databases.resources.map((db) => {
        return get_containers_by_db(client, db.id);
      })
    );
    const container_items = await Promise.all(
      cosmosdb_containers
        .map((containers) => {
          return get_container_ids(containers.response, containers.db_id);
        })
        .map((containers) => {
          return Promise.all(
            containers.map((container) => {
              return get_items_by_container_and_db(
                client,
                container.db_id,
                container.container_id
              );
            })
          );
        })
    );

    const items = container_items
      .map((containers) => {
        return containers.map((container) => {
          return {
            db_id: container.db_id,
            container_id: container.container_id,
            item_count: container.response.resources.length,
            items: container.response.resources,
          };
        });
      })
      .reduce((acc, val) => acc.concat(val), []);

    return items;
  } catch (e) {
    logger.error({
      module: "Cosmosdb_client.get_items",
      error: e,
    });
    process.exit(1);
  }
};
