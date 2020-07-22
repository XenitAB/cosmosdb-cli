import * as Config_model from "../models/config";
import * as Commands_model from "../models/commands";
import * as Config_client from "./config";
import * as Cosmosdb_client from "./cosmosdb";
import * as Storageaccount_client from "./storageaccount";
import * as Backup_client from "./backup";

const pretty_print_enum = <T>(e: T) => Object.values(e).join(", ");

export const client = (args: Commands_model.commands): Promise<void> => {
  switch (args.command) {
    case Commands_model.Command.backup:
      if (args.sub_command) {
        switch (args.sub_command) {
          case Commands_model.Backup_sub_command.azure_storage_account:
            return Config_client.to_config({
              ...Config_model.cosmosdb,
              ...Config_model.azure_storage_account,
            }).then((config) =>
              Cosmosdb_client.client(
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
                )
            );
          case Commands_model.Backup_sub_command.filesystem:
            return Config_client.to_config({
              ...Config_model.cosmosdb,
              ...Config_model.filesystem,
            }).then((config) =>
              Cosmosdb_client.client(
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
                )
            );
        }
      } else {
        throw new Error("No sub_command defined.");
      }
    case Commands_model.Command.restore:
      if (args.sub_command) {
        switch (args.sub_command) {
          case Commands_model.Restore_sub_command.azure_storage_account:
            throw new Error("Not implemented yet.");
          case Commands_model.Restore_sub_command.filesystem:
            throw new Error("Not implemented yet.");
        }
      } else {
        throw new Error("No sub_command defined.");
      }
  }
};
