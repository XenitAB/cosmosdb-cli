import {
  get_cosmosdb_client,
  start_cosmosdb_server,
  create_cosmosdb_db_container_items,
  stop_cosmosdb_server,
  remove_all_cosmosdb_databases,
} from "../helpers";
import fs from "fs-extra";
import * as Config_models from "../../models/config";
import { ItemDefinition } from "@azure/cosmos";
import cosmosdb_server from "@zeit/cosmosdb-server";
import * as Args_model from "../../models/args";
import * as Commands_model from "../../models/commands";
import * as Cli_client from "../../clients/cli";
import logger from "../../clients/logger";

const date_string = Date.now().toString();
const filesystem_path = "/tmp/";

const mock_port = 3002;
const mock_cosmosdb: Config_models.cosmosdb = {
  cosmosdb_account_endpoint: `https://localhost:${mock_port}`,
  cosmosdb_account_key: "dummy key",
  cosmosdb_reject_unauthorized: false,
  cosmosdb_use_keyvault: false,
};
const mock_filesystem: Config_models.filesystem = {
  filesystem_path: filesystem_path,
  filesystem_prefix: `${date_string}/`,
  filesystem_suffix: "",
  filesystem_delimiter: "/",
};

const server = cosmosdb_server();

const argv: string[] = [
  "node",
  "cosmocli",
  "backup",
  "filesystem",
  "--cosmosdb-account-endpoint",
  mock_cosmosdb.cosmosdb_account_endpoint,
  "--cosmosdb-account-key",
  mock_cosmosdb.cosmosdb_account_key,
  "--cosmosdb-reject-unauthorized",
  mock_cosmosdb.cosmosdb_reject_unauthorized.toString(),
  "--filesystem-path",
  mock_filesystem.filesystem_path,
  "--filesystem-prefix",
  mock_filesystem.filesystem_prefix,
];

process.argv = argv;
logger.info = jest.fn();

const cosmosdb_client = get_cosmosdb_client(mock_cosmosdb);

const mock_item1: ItemDefinition = {
  id: "1",
  foo: "bar",
};
const mock_item2: ItemDefinition = {
  id: "2",
  foo: "bar",
};
const mock_item3: ItemDefinition = {
  id: "3",
  foo: "bar",
};
export const mock_items: ItemDefinition[] = [
  mock_item1,
  mock_item2,
  mock_item3,
];

beforeAll(async (done) => {
  await start_cosmosdb_server(server, mock_port).then(done);
});

afterAll(async (done) => {
  await stop_cosmosdb_server(server).then(done);
});

describe("end-to-end backup filesystem one db one container", () => {
  it("should create one file with json array with three items", (done) => {
    expect.assertions(1);
    remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db1",
          "container1",
          mock_items
        )
      )
      .then(() => Args_model.from_args(process.argv.slice(2)))
      .then(Commands_model.from_args)
      .then(Cli_client.client)
      .then(() =>
        fs.readFile(`${filesystem_path}${date_string}/db1/container1`, "UTF-8")
      )
      .then((output) => expect(JSON.parse(output).length).toEqual(3))
      .then(() => fs.remove(`${filesystem_path}${date_string}/db1/container1`))
      .then(done);
  });
});

describe("end-to-end backup filesystem two dbs two containers", () => {
  it("should create two files with json array with three items", async (done) => {
    expect.assertions(2);
    await remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db2",
          "container1",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db3",
          "container1",
          mock_items
        )
      )
      .then(() => Args_model.from_args(process.argv.slice(2)))
      .then(Commands_model.from_args)
      .then(Cli_client.client)
      .then(() =>
        fs.readFile(`${filesystem_path}${date_string}/db2/container1`, "UTF-8")
      )
      .then((output) => expect(JSON.parse(output).length).toEqual(3))
      .then(() => fs.remove(`${filesystem_path}${date_string}/db2/container1`))
      .then(() =>
        fs.readFile(`${filesystem_path}${date_string}/db3/container1`, "UTF-8")
      )
      .then((output) => expect(JSON.parse(output).length).toEqual(3))
      .then(() => fs.remove(`${filesystem_path}${date_string}/db3/container1`))
      .then(done);
  });
});

describe("end-to-end backup filesystem two dbs three containers", () => {
  it("should create two files with json array with three items", async (done) => {
    expect.assertions(3);
    await remove_all_cosmosdb_databases(cosmosdb_client)
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db4",
          "container1",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db5",
          "container1",
          mock_items
        )
      )
      .then(() =>
        create_cosmosdb_db_container_items(
          cosmosdb_client,
          "db5",
          "container2",
          mock_items
        )
      )
      .then(() => Args_model.from_args(process.argv.slice(2)))
      .then(Commands_model.from_args)
      .then(Cli_client.client)
      .then(() =>
        fs.readFile(`${filesystem_path}${date_string}/db4/container1`, "UTF-8")
      )
      .then((output) => expect(JSON.parse(output).length).toEqual(3))
      .then(() => fs.remove(`${filesystem_path}${date_string}/db4/container1`))
      .then(() =>
        fs.readFile(`${filesystem_path}${date_string}/db5/container1`, "UTF-8")
      )
      .then((output) => expect(JSON.parse(output).length).toEqual(3))
      .then(() => fs.remove(`${filesystem_path}${date_string}/db5/container1`))
      .then(() =>
        fs.readFile(`${filesystem_path}${date_string}/db5/container2`, "UTF-8")
      )
      .then((output) => expect(JSON.parse(output).length).toEqual(3))
      .then(() => fs.remove(`${filesystem_path}${date_string}/db5/container2`))
      .then(done);
  });
});
