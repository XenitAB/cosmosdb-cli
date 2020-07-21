type args = string[];
type command = string;
type sub_command = string;

export type t = {
  command: command;
  sub_command?: sub_command;
  args?: args;
};
