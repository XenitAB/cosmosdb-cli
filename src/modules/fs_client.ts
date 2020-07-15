import fs from "fs-extra";
import path from "path";
import logger from "./logger";

async function create_directories_recursive(filename: string): Promise<void> {
  try {
    const directory = path.parse(filename).dir;
    await fs.ensureDir(directory);
  } catch (e) {
    logger.error({
      function: "Fs_client.create_directories_recursive",
      error: e,
    });
    process.exit(1);
  }
}

export async function save_item(
  items: string,
  file_name: string
): Promise<void> {
  try {
    await create_directories_recursive(file_name);
    logger.debug({
      function: "Fs_client.save_item",
      message: `Saving to ${file_name}`,
    });
    await fs.writeFile(file_name, items);
    logger.debug({
      function: "Fs_client.save_item",
      message: `Finished saving to ${file_name}`,
    });
  } catch (e) {
    logger.error({
      function: "Fs_client.save_item",
      error: e,
    });
    process.exit(1);
  }
}
