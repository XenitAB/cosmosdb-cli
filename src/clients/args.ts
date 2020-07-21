import * as Args_models from "../models/args";

const to_command = (t: string[]): Promise<Args_models.t> => {
  return new Promise((resolve, reject) => {
    try {
      if (t[0] && t[0].length > 0 && t[0].charAt(0) !== "-") {
        resolve({ command: t[0], args: t.slice(1) });
      } else {
        reject({
          module: "Args_client.to_command",
          error: "Unable to locate command.",
        });
      }
    } catch (e) {
      reject({
        module: "Args_client.to_command",
        error: e,
      });
    }
  });
};

const to_sub_command = (t: Args_models.t): Promise<Args_models.t> => {
  return new Promise((resolve, reject) => {
    try {
      if (t.args && t.args.length > 0) {
        const args = t.args;
        if (args[0].charAt(0) !== "-") {
          const sub_command = args[0];
          if (args.slice(1).length > 0) {
            resolve({
              command: t.command,
              sub_command: sub_command,
              args: args.slice(1),
            });
          } else {
            resolve({
              command: t.command,
              sub_command: sub_command,
            });
          }
        } else if (args[0].charAt(0) === "-") {
          resolve({
            command: t.command,
            args: args,
          });
        } else {
          resolve({
            command: t.command,
          });
        }
      } else {
        resolve({
          command: t.command,
        });
      }
    } catch (e) {
      reject({
        module: "Args_client.to_sub_command",
        error: e,
      });
    }
  });
};

export const from_args = (t: string[]): Promise<Args_models.t> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(to_command(t).then(to_sub_command));
    } catch (e) {
      reject(new Error(e));
    }
  });
};
