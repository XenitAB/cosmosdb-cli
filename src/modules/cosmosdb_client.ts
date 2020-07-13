import logger from "./logger";
import {
  CosmosClient,
  FeedResponse,
  DatabaseDefinition,
  ContainerDefinition,
  ItemDefinition,
  Resource,
} from "@azure/cosmos";

export function cosmosdb_client(endpoint: string, key: string): CosmosClient {
  try {
    const client = new CosmosClient({
      endpoint: endpoint,
      key: key,
    });
    return client;
  } catch (e) {
    logger.error({
      function: "cosmosdb_client",
      error: e,
    });
    process.exit(1);
  }
}

async function get_comsosdb_databases(
  client: CosmosClient
): Promise<FeedResponse<DatabaseDefinition & Resource>> {
  try {
    return await client.databases.readAll().fetchAll();
  } catch (e) {
    logger.error({
      function: "get_comsosdb_databases",
      error: e,
    });
    process.exit(1);
  }
}

type cosmosdb_containers_by_db_type = {
  response: FeedResponse<ContainerDefinition & Resource>;
  db_id: string;
};

async function get_cosmosdb_containers_by_db(
  client: CosmosClient,
  db_id: string
): Promise<cosmosdb_containers_by_db_type> {
  try {
    return {
      response: await client.database(db_id).containers.readAll().fetchAll(),
      db_id: db_id,
    };
  } catch (e) {
    logger.error({
      function: "get_cosmosdb_containers_by_db",
      error: e,
    });
    process.exit(1);
  }
}

type cosmosdb_container_id_type = {
  db_id: string;
  container_id: string;
};

type cosmosdb_container_ids_type = Array<cosmosdb_container_id_type>;

function get_cosmosdb_container_ids(
  response: FeedResponse<ContainerDefinition & Resource>,
  db_id: string
): cosmosdb_container_ids_type {
  try {
    return response.resources.map((container) => {
      return {
        db_id: db_id as string,
        container_id: container.id as string,
      };
    });
  } catch (e) {
    logger.error({
      function: "get_cosmosdb_container_ids",
      error: e,
    });
    process.exit(1);
  }
}

type cosmosdb_items_by_container_and_db_type = {
  response: FeedResponse<ItemDefinition>;
  db_id: string;
  container_id: string;
};

async function get_cosmosdb_itemsByContainerAndDb(
  client: CosmosClient,
  db_id: string,
  container_id: string
): Promise<cosmosdb_items_by_container_and_db_type> {
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
      function: "get_cosmosdb_itemsByContainerAndDb",
      error: e,
    });
    process.exit(1);
  }
}

export type cosmosdb_items_type = Array<{
  db_id: string;
  container_id: string;
  item_count: number;
  items: ItemDefinition[];
}>;

export async function get_cosmosdb_items(
  client: CosmosClient
): Promise<cosmosdb_items_type> {
  try {
    const cosmosdb_databases = await get_comsosdb_databases(client);
    const cosmosdb_containers = await Promise.all(
      cosmosdb_databases.resources.map((db) => {
        return get_cosmosdb_containers_by_db(client, db.id);
      })
    );
    const container_items = await Promise.all(
      cosmosdb_containers
        .map((containers) => {
          return get_cosmosdb_container_ids(
            containers.response,
            containers.db_id
          );
        })
        .map((containers) => {
          return Promise.all(
            containers.map((container) => {
              return get_cosmosdb_itemsByContainerAndDb(
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
      function: "get_cosmosdb_items",
      error: e,
    });
    process.exit(1);
  }
}
