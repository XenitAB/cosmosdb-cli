import * as Commands_model from "../models/commands";
// types
type args = string[];
type command = string;
type sub_command = string;

export type t = {
  command: command;
  sub_command?: sub_command;
  args?: args;
};

const pretty_print_enum = <T>(e: T) => Object.values(e).join(", ");

// functions
const to_command = (t: string[]): Promise<t> => {
  return new Promise((resolve, reject) => {
    try {
      const [command, ...args] = t;
      if (command != null && command.length > 0 && command.charAt(0) !== "-") {
        resolve({ command, args });
      } else {
        reject({
          module: "Args_client.to_command",
          error: `Unknown command: ${command}. Try: ${pretty_print_enum(
            Commands_model.Command
          )}`,
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

const to_sub_command = (t: t): Promise<t> => {
  return new Promise((resolve, reject) => {
    if (t.args != null && t.args.length > 0) {
      const [sub_command, ...args] = t.args;
      try {
        if (sub_command.charAt(0) !== "-") {
          if (args.length > 0) {
            resolve({
              command: t.command,
              sub_command,
              args,
            });
          } else {
            resolve({
              command: t.command,
              sub_command,
            });
          }
        } else if (sub_command.charAt(0) === "-") {
          resolve({
            command: t.command,
            args,
          });
        } else {
          resolve({
            command: t.command,
          });
        }
        /*

        reject();
        */
      } catch (e) {
        reject(e);
      }
    } else {
      resolve({
        command: t.command,
      });
    }
  });
};

export const from_args = (t: string[]): Promise<t> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(to_command(t).then(to_sub_command));
    } catch (e) {
      reject(new Error(e));
    }
  });
};
