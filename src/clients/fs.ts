import fs from "fs-extra";
import path from "path";
import logger from "./logger";

const create_directories_recursive = (filename: string): Promise<void> => {
  const directory = path.parse(filename).dir;
  return fs.ensureDir(directory);
};

export const save_item = (items: string, file_name: string): Promise<void> => {
  return create_directories_recursive(file_name).then(() => {
    logger.info({
      location: "Fs.save_item",
      msg: "Saving item",
      destination: file_name,
    });
    fs.writeFile(file_name, items).then(() => {
      logger.info({
        location: "Fs.save_item",
        msg: "Saved item",
        destination: file_name,
      });
    });
  });
};
