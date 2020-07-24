import * as Config_model from "../../../models/config";
import * as Commands_model from "../../../models/commands";
import * as Config_client from "../../config";
import * as Cosmosdb_client from "../../cosmosdb";
import * as Storageaccount_client from "../../storageaccount";
import * as Backup_client from "../../backup";

export const client = (args: Commands_model.commands): Promise<void> => {
  const config = Config_client.to_config({
    ...Config_model.cosmosdb,
    ...Config_model.azure_storage_account,
  });
  return Cosmosdb_client.client(
    config.get("cosmosdb_account_endpoint"),
    config.get("cosmosdb_account_key")
  )
    .then(Cosmosdb_client.get_all_items)
    .then((items_by_containers) =>
      Storageaccount_client.container_client(
        config.get("storage_account_name"),
        config.get("storage_account_container"),
        config.get("storage_account_key")
      ).then((container_client) =>
        Backup_client.backup_cosmosdb_containers_to_storage_account_blob(
          container_client,
          items_by_containers,
          `${Date.now().toString()}/`
        )
      )
    );
};
