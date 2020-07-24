import * as Config_model from "../../../models/config";
import * as Commands_model from "../../../models/commands";
import * as Config_client from "../../config";
import * as Cosmosdb_client from "../../cosmosdb";
import * as Storageaccount_client from "../../storageaccount";
import * as Backup_client from "../../backup";

export const client = (): Promise<void> => {
  const cosmosdb_config = Config_client.to_config(Config_model.cosmosdb);
  const storageaccount_config = Config_client.to_config(
    Config_model.azure_storage_account
  );
  return Cosmosdb_client.client(cosmosdb_config)
    .then(Cosmosdb_client.get_all_items)
    .then((items_by_containers) =>
      Storageaccount_client.container_client(
        storageaccount_config
      ).then((container_client) =>
        Backup_client.backup_cosmosdb_containers_to_storage_account_blob(
          container_client,
          items_by_containers,
          `${Date.now().toString()}/`
        )
      )
    );
};
