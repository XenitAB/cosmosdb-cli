import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import JsonStreamStringify from "json-stream-stringify";

import { save_item } from "./fs";
import logger from "./logger";

logger.info = jest.fn();

const date = Date.now();
const random_string = uuidv4();
const file_path = `/tmp/${random_string}`;
const file_name = `${file_path}/${date}.txt`;
const mock_object = {
  date,
  uuid: random_string,
  test: true,
  something: "test",
};

describe("fs tests", () => {
  it("should create file with json data", async (done) => {
    const json_data = new JsonStreamStringify(mock_object);

    expect.assertions(1);

    await save_item(json_data, file_name)
      .then(() => fs.readFile(file_name, "UTF-8"))
      .then((output) => expect(JSON.parse(output)).toEqual(mock_object))
      .then(() => fs.remove(file_path))
      .then(done);
  });
});
