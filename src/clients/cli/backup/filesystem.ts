import * as Config_model from "../../../models/config";
import * as Commands_model from "../../../models/commands";
import * as Config_client from "../../config";
import * as Cosmosdb_client from "../../cosmosdb";
import * as Backup_client from "../../backup";

export const client = (args: Commands_model.commands): Promise<void> => {
  const config = Config_client.to_config({
    ...Config_model.cosmosdb,
    ...Config_model.filesystem,
  });
  return Cosmosdb_client.client(
    config.get("cosmosdb_account_endpoint"),
    config.get("cosmosdb_account_key")
  )
    .then(Cosmosdb_client.get_all_items)
    .then((items_by_containers) =>
      Backup_client.backup_cosmosdb_containers_to_filesystem(
        items_by_containers,
        config.get("filesystem_path"),
        `${Date.now().toString()}/`
      )
    );
};
