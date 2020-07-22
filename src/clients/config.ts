import Convict from "convict";

export const to_config = <T>(schema: Convict.Schema<T>): Convict.Config<T> => {
  return Convict(schema);
};
