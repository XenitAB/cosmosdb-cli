import * as Commands_model from "../../../models/commands";

export const client = (args: Commands_model.commands): Promise<void> => {
  if (args.sub_command) {
    const sub_command_type = Commands_model.get_backup_sub_command(
      args.sub_command
    );
    return import(`./${sub_command_type}`).then((sub_command) =>
      sub_command.client(args)
    );
  } else {
    throw new Error("Unknown sub_command.");
  }
};
