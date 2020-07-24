import * as Args_models from "./args";

export enum Command {
  backup = "backup",
  restore = "restore",
}

export enum Backup_command {
  azure_file_system = "azure-file-system",
  filesystem = "filesystem",
}

export enum Restore_command {
  azure_file_system = "azure-file-system",
  filesystem = "filesystem",
}

export const get_valid_sub_commands = (
  command: Command
): Backup_command[] | Restore_command[] => {
  switch (command) {
    case Command.backup:
      return Object.values(Backup_command);
    case Command.restore:
      return Object.values(Restore_command);
    default:
      throw new Error(
        `${command} is not a valid command, try ${Object.values(Command).join(
          ", "
        )}`
      );
  }
};

export const is_command = (s: string): s is Command => {
  return Object.values(Command).includes(s as Command);
};

export enum Backup_sub_command {
  azure_storage_account = "azure-storage-account",
  filesystem = "filesystem",
}

export enum Restore_sub_command {
  azure_storage_account = "azure-storage-account",
  filesystem = "filesystem",
}

const is_valid_backup_sub_command = (s: string): s is Backup_sub_command => {
  return Object.values(Backup_sub_command).includes(s as Backup_sub_command);
};

const is_valid_restore_sub_command = (s: string): s is Restore_sub_command => {
  return Object.values(Restore_sub_command).includes(s as Restore_sub_command);
};

export const get_backup_sub_command = (s: string): string => {
  return Object.entries(Backup_sub_command)
    .filter(([_key, value]) => {
      if (value === s) {
        return true;
      }
    })
    .reduce((_acc, [key, _value]) => key, {})
    .toString();
};

export const get_restore_sub_command = (s: string): string => {
  return Object.entries(Restore_sub_command)
    .filter(([_key, value]) => {
      if (value === s) {
        return true;
      }
    })
    .reduce((_acc, [key, _value]) => key, {})
    .toString();
};

type t<command, sub_command> = {
  command: command;
  sub_command?: sub_command;
  args?: string[];
};

type backup_azure_storage_account = t<
  Command.backup,
  Backup_sub_command.azure_storage_account
>;

type backup_filesystem = t<Command.backup, Backup_sub_command.filesystem>;

type restore_azure_storage_account = t<
  Command.restore,
  Restore_sub_command.azure_storage_account
>;

type restore_filesystem = t<Command.restore, Restore_sub_command.filesystem>;

// Commands
export type commands =
  | backup_azure_storage_account
  | backup_filesystem
  | restore_azure_storage_account
  | restore_filesystem;

export const from_args = (args: Args_models.t): Promise<commands> => {
  return new Promise((resolve, reject) => {
    const reject_sub_command = (command: Command) => {
      return reject({
        module: "Commands.from_args",
        error: `Unknown sub_command: ${
          args.sub_command
        }. Try: ${get_valid_sub_commands(command).join(", ")}`,
      });
    };
    if (args.command === Command.backup) {
      if (
        args.sub_command != null &&
        is_valid_backup_sub_command(args.sub_command)
      ) {
        return resolve({
          command: args.command,
          sub_command: args.sub_command,
          args: args.args,
        });
      } else if (args.sub_command != null) {
        return reject_sub_command(args.command);
      } else {
        return resolve({
          command: args.command,
        });
      }
    } else if (args.command === Command.restore) {
      if (
        args.sub_command != null &&
        is_valid_restore_sub_command(args.sub_command)
      ) {
        return resolve({
          command: args.command,
          sub_command: args.sub_command,
          args: args.args,
        });
      } else if (args.sub_command != null) {
        return reject_sub_command(args.command);
      }
      return resolve({
        command: args.command,
      });
    } else {
      reject({
        module: "Commands.from_args",
        error: `Unknown command: ${args.command}. Try: ${Object.values(
          Command
        ).join(", ")}`,
      });
    }
  });
};
