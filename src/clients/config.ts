import Convict from "convict";

export const to_config = <T>(
  schema: Convict.Schema<T>
): Promise<Convict.Config<T>> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(Convict(schema));
    } catch (e) {
      reject(e);
    }
  });
};
