import * as Args_model from "./args";

describe("args model test", () => {
  it("should return valid command", (done) => {
    expect.assertions(1);
    Args_model.from_args(["command"])
      .then((args) => {
        expect(args).toEqual({
          command: "command",
        });
      })
      .then(done);
  });

  it("should return valid sub_command", (done) => {
    expect.assertions(1);
    Args_model.from_args(["command", "sub_command"])
      .then((args) => {
        expect(args).toEqual({
          command: "command",
          sub_command: "sub_command",
        });
      })
      .then(done);
  });

  it("should return command with valid args", (done) => {
    expect.assertions(1);
    Args_model.from_args(["command", "--key", "value"])
      .then((args) => {
        expect(args).toEqual({
          command: "command",
          args: ["--key", "value"],
        });
      })
      .then(done);
  });

  it("should return sub_command with valid args", (done) => {
    expect.assertions(1);
    Args_model.from_args(["command", "sub_command", "--key", "value"])
      .then((args) => {
        expect(args).toEqual({
          command: "command",
          sub_command: "sub_command",
          args: ["--key", "value"],
        });
      })
      .then(done);
  });

  it("should throw when no command is defined", (done) => {
    expect.assertions(1);
    Args_model.from_args(["--key", "value"])
      .catch((e) => {
        expect(e.error).toContain("Unknown command:");
      })
      .then(done);
  });
});
