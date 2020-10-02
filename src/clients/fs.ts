import { Readable } from "stream";
import { createWriteStream } from "fs";
import path from "path";
import fs from "fs-extra";

import logger from "./logger";

const create_directories_recursive = (filename: string): Promise<void> => {
  const directory = path.parse(filename).dir;
  return fs.ensureDir(directory);
};

export const save_item = (
  items: Readable,
  file_name: string
): Promise<void> => {
  return create_directories_recursive(file_name).then(() => {
    logger.info({
      location: "Fs.save_item",
      msg: "Saving item",
      destination: file_name,
    });

    return new Promise((resolve, reject) => {
      try {
        const write_stream = createWriteStream(file_name, {
          encoding: "utf8",
        });

        items.pipe(write_stream);

        items.on("end", () => {
          write_stream.close();
        });

        write_stream.on("close", () => {
          logger.info({
            location: "Fs.save_item",
            msg: "Saved item",
            destination: file_name,
          });
          resolve();
        });

        items.on("error", (error) => {
          logger.error({
            location: "Fs.save_item",
            msg: "Save item error",
            destination: file_name,
            error,
          });
          reject(error);
        });
      } catch (error) {
        logger.error({
          location: "Fs.save_item",
          msg: "Stream error",
          destination: file_name,
          error,
        });
        reject(error);
      }
    });
  });
};
