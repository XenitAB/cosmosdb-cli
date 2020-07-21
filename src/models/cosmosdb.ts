import { CosmosClient, ItemDefinition } from "@azure/cosmos";

export type database = {
  client: CosmosClient;
  db_id: string;
};

export type databases = database[];

export type container = database & {
  container_id: string;
};

export type containers = container[];

export type items_by_container = container & {
  item_count: number;
  items: ItemDefinition[];
};

export type items_by_containers = items_by_container[];
