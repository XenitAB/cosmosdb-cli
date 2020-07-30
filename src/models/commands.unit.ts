import * as Commands_model from "./commands";
import * as Args_model from "./args";

const mock_backup: Args_model.t = {
  command: "backup",
};

const mock_backup_azure_storage_account: Args_model.t = {
  command: "backup",
  sub_command: "azure-storage-account",
};

const mock_backup_filesystem: Args_model.t = {
  command: "backup",
  sub_command: "filesystem",
};

const mock_backup_unknown: Args_model.t = {
  command: "backup",
  sub_command: "unknown",
};

const mock_restore: Args_model.t = {
  command: "restore",
};

const mock_restore_azure_storage_account: Args_model.t = {
  command: "restore",
  sub_command: "azure-storage-account",
};

const mock_restore_filesystem: Args_model.t = {
  command: "restore",
  sub_command: "filesystem",
};

const mock_restore_unknown: Args_model.t = {
  command: "restore",
  sub_command: "unknown",
};

describe("commands model tests - backup", () => {
  it("should return work with backup", (done) => {
    Commands_model.from_args(mock_backup)
      .then((command) => {
        expect(command).toEqual(mock_backup);
      })
      .then(done);
  });

  it("should return work with backup azure-storage-account", (done) => {
    Commands_model.from_args(mock_backup_azure_storage_account)
      .then((command) => {
        expect(command).toEqual(mock_backup_azure_storage_account);
      })
      .then(done);
  });

  it("should return work with backup filesystem", (done) => {
    Commands_model.from_args(mock_backup_filesystem)
      .then((command) => {
        expect(command).toEqual(mock_backup_filesystem);
      })
      .then(done);
  });

  it("should fail with unknown sub_command", (done) => {
    Commands_model.from_args(mock_backup_unknown)
      .catch((e) => {
        expect(e.error).toContain("Unknown sub_command:");
      })
      .then(done);
  });
});

describe("commands model tests - restore", () => {
  it("should return work with restore", (done) => {
    Commands_model.from_args(mock_restore)
      .then((command) => {
        expect(command).toEqual(mock_restore);
      })
      .then(done);
  });

  it("should return work with restore azure-storage-account", (done) => {
    Commands_model.from_args(mock_restore_azure_storage_account)
      .then((command) => {
        expect(command).toEqual(mock_restore_azure_storage_account);
      })
      .then(done);
  });

  it("should return work with restore filesystem", (done) => {
    Commands_model.from_args(mock_restore_filesystem)
      .then((command) => {
        expect(command).toEqual(mock_restore_filesystem);
      })
      .then(done);
  });

  it("should fail with unknown subcommand", (done) => {
    Commands_model.from_args(mock_restore_unknown)
      .catch((e) => {
        expect(e.error).toContain("Unknown sub_command");
      })
      .then(done);
  });
});

describe("commands model tests - unknwon", () => {
  it("should fail with unknown command", (done) => {
    Commands_model.from_args({ command: "unknown" })
      .catch((e) => {
        expect(e.error).toContain("Unknown command");
      })
      .then(done);
  });
});
