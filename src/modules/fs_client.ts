import fs from "fs-extra";
import path from "path";
import logger from "./logger";

async function CreateDirectoriesRecursive(filename: string): Promise<void> {
  try {
    const directory = path.parse(filename).dir;
    await fs.ensureDir(directory);
  } catch (e) {
    logger.error({
      function: "CreateDirectoriesRecursive",
      error: e,
    });
    process.exit(1);
  }
}

export async function SaveContentToFilesystem(
  items: string,
  file_name: string
): Promise<void> {
  try {
    await CreateDirectoriesRecursive(file_name);
    logger.debug({
      function: "SaveContentToFilesystem",
      message: `Saving to ${file_name}`,
    });
    await fs.writeFile(file_name, items);
    logger.debug({
      function: "SaveContentToFilesystem",
      message: `Finished saving to ${file_name}`,
    });
  } catch (e) {
    logger.error({
      function: "SaveContentToFilesystem",
      error: e,
    });
    process.exit(1);
  }
}
