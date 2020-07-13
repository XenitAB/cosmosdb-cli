import logger from "./logger";
import {
  CosmosClient,
  FeedResponse,
  DatabaseDefinition,
  ContainerDefinition,
  ItemDefinition,
  Resource,
} from "@azure/cosmos";

export function CosmosDBClient(endpoint: string, key: string): CosmosClient {
  try {
    const client = new CosmosClient({
      endpoint: endpoint,
      key: key,
    });
    return client;
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

async function GetCosmosDBDatabases(
  client: CosmosClient
): Promise<FeedResponse<DatabaseDefinition & Resource>> {
  try {
    return await client.databases.readAll().fetchAll();
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

type CosmosDBContainersByDbType = {
  response: FeedResponse<ContainerDefinition & Resource>;
  db_id: string;
};

async function GetCosmosDBContainersByDb(
  client: CosmosClient,
  db_id: string
): Promise<CosmosDBContainersByDbType> {
  try {
    return {
      response: await client.database(db_id).containers.readAll().fetchAll(),
      db_id: db_id,
    };
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

type CosmosDBContainerIDType = {
  db_id: string;
  container_id: string;
};

type CosmosDBContainerIDsType = Array<CosmosDBContainerIDType>;

function GetCosmosDBContainerIDs(
  response: FeedResponse<ContainerDefinition & Resource>,
  db_id: string
): CosmosDBContainerIDsType {
  try {
    return response.resources.map((container) => {
      return {
        db_id: db_id as string,
        container_id: container.id as string,
      };
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

type CosmosDBItemsByContainerAndDbType = {
  response: FeedResponse<ItemDefinition>;
  db_id: string;
  container_id: string;
};

async function GetCosmosDBItemsByContainerAndDb(
  client: CosmosClient,
  db_id: string,
  container_id: string
): Promise<CosmosDBItemsByContainerAndDbType> {
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
    logger.error(e);
    process.exit(1);
  }
}

export type CosmosDBItemsType = Array<{
  db_id: string;
  container_id: string;
  item_count: number;
  items: ItemDefinition[];
}>;

export async function GetCosmosDBItems(
  client: CosmosClient
): Promise<CosmosDBItemsType> {
  try {
    const cosmosdb_databases = await GetCosmosDBDatabases(client);
    const cosmosdb_containers = await Promise.all(
      cosmosdb_databases.resources.map((db) => {
        return GetCosmosDBContainersByDb(client, db.id);
      })
    );
    const container_items = await Promise.all(
      cosmosdb_containers
        .map((containers) => {
          return GetCosmosDBContainerIDs(containers.response, containers.db_id);
        })
        .map((containers) => {
          return Promise.all(
            containers.map((container) => {
              return GetCosmosDBItemsByContainerAndDb(
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
    logger.error(e);
    process.exit(1);
  }
}
