import fs from "fs-extra";
import path, { resolve } from "path";

const create_directories_recursive = (filename: string): Promise<void> => {
  return new Promise((_resolve, reject) => {
    try {
      const directory = path.parse(filename).dir;
      fs.ensureDir(directory).then(_resolve).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

export const save_item = (items: string, file_name: string): Promise<void> => {
  return new Promise((_resolve, reject) => {
    try {
      create_directories_recursive(file_name).then((_) => {
        fs.writeFile(file_name, items).then(_resolve).catch(reject);
      });
    } catch (e) {
      reject(e);
    }
  });
};
