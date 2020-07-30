import { save_item } from "./fs";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
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
const json_data = JSON.stringify(mock_object);

describe("fs tests", () => {
  afterAll((done) => {
    fs.remove(file_path).then(done);
  });

  it("should create file with json data", (done) => {
    expect.assertions(1);

    save_item(json_data, file_name)
      .then(() => fs.readFile(file_name, "UTF-8"))
      .then((output) => expect(JSON.parse(output)).toEqual(mock_object))
      .then(done);
  });
});
