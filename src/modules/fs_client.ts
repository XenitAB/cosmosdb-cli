import fs from "fs-extra";
import path from "path";
import logger from "./logger";

function CreateDirectoriesRecursive(filename: string): void {
  try {
    const directory = path.parse(filename).dir;
    fs.ensureDirSync(directory);
  } catch (e) {
    logger.error({
      function: "CreateDirectoriesRecursive",
      error: e,
    });
    process.exit(1);
  }
}

export function SaveContentToFilesystem(
  items: string,
  file_name: string
): void {
  try {
    CreateDirectoriesRecursive(file_name);
    fs.writeFileSync(file_name, items);
  } catch (e) {
    logger.error({
      function: "SaveContentToFilesystem",
      error: e,
    });
    process.exit(1);
  }
}
