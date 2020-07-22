import fs from "fs-extra";
import path from "path";

const create_directories_recursive = (filename: string): Promise<void> => {
  const directory = path.parse(filename).dir;
  return fs.ensureDir(directory);
};

export const save_item = (items: string, file_name: string): Promise<void> => {
  return create_directories_recursive(file_name).then(() =>
    fs.writeFile(file_name, items)
  );
};
