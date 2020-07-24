import * as Commands_model from "../../models/commands";

export const client = (args: Commands_model.commands): Promise<void> => {
  return import(`./${args.command}/index.ts`).then((command) =>
    command.client(args)
  );
};
