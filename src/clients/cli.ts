import * as Args_models from "../models/args";

export const client = (args: Args_models.t): Promise<void> => {
  return new Promise((_resolve, reject) => {
    try {
      switch (args.command) {
        case "backup":
          if (args.sub_command) {
            switch (args.sub_command) {
              case "azure_storage_account":
                break;
              case "filesystem":
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
              case "azure_storage_account":
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
