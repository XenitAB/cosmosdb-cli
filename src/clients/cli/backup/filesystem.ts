import * as Config_model from "../../../models/config";
import * as Commands_model from "../../../models/commands";
import * as Config_client from "../../config";
import * as Cosmosdb_client from "../../cosmosdb";
import * as Backup_client from "../../backup";

export const client = (): Promise<void> => {
  const cosmosdb_config = Config_client.to_config(Config_model.cosmosdb);
  const filesystem_config = Config_client.to_config(Config_model.filesystem);
  return Cosmosdb_client.client(cosmosdb_config)
    .then(Cosmosdb_client.get_all_items)
    .then((items_by_containers) =>
      Backup_client.backup_cosmosdb_containers_to_filesystem(
        items_by_containers,
        filesystem_config,
        `${Date.now().toString()}/`
      )
    );
};
