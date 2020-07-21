import * as Args_models from "../models/args";
import * as Config_fixtures from "../fixtures/config";
import * as Config_client from "./config";
import * as Cosmosdb_client from "./cosmosdb";
import * as Backup_client from "./backup";

export const client = (args: Args_models.t): Promise<void> => {
  return new Promise((_resolve, reject) => {
    try {
      switch (args.command) {
        case "backup":
          if (args.sub_command) {
            switch (args.sub_command) {
              case "azure-storage-account":
                Config_client.to_config({
                  ...Config_fixtures.cosmosdb,
                  ...Config_fixtures.azure_storage_account,
                }).then((config) => {
                  Cosmosdb_client.client(
                    config.get("cosmosdb_account_endpoint"),
                    config.get("cosmosdb_account_key")
                  )
                    .then(Cosmosdb_client.get_all_items)
                    .then(console.log)
                    .then(_resolve)
                    .catch(reject);
                });
                break;
              case "filesystem":
                Config_client.to_config({
                  ...Config_fixtures.cosmosdb,
                  ...Config_fixtures.filesystem,
                }).then((config) => {
                  Cosmosdb_client.client(
                    config.get("cosmosdb_account_endpoint"),
                    config.get("cosmosdb_account_key")
                  )
                    .then(Cosmosdb_client.get_all_items)
                    .then((items_by_containers) => {
                      Backup_client.backup_cosmosdb_containers_to_filesystem(
                        items_by_containers,
                        config.get("filesystem_path"),
                        `${Date.now().toString()}/`
                      )
                        .then(_resolve)
                        .catch(reject);
                    });
                });
                break;
              default:
                reject("Unknown sub_command: " + args.sub_command);
            }
          } else {
            reject("No sub_command defined.");
          }
          break;
        case "restore":
          if (args.sub_command) {
            switch (args.sub_command) {
              case "azure-storage-account":
                reject("Not implemented yet.");
                break;
              case "filesystem":
                reject("Not implemented yet.");
                break;
              default:
                reject("Unknown sub_command: " + args.sub_command);
            }
          } else {
            reject("No sub_command defined.");
          }
          break;
        default:
          reject("Unknown command: " + args.command);
          break;
      }
    } catch (e) {
      reject(e);
    }
  });
};
