// Backup
type backup = {
  command: "backup";
};

type backup_azure_storage_account = {
  sub_command: "azure_storage_account";
} & backup;

type backup_filesystem = {
  sub_command: "filesystem";
} & backup;

type backup_commands = backup_azure_storage_account | backup_filesystem;

// Restore
type restore = {
  command: "restore";
};

type restore_azure_storage_account = {
  sub_command: "azure_storage_account";
} & restore;

type restore_filesystem = {
  sub_command: "filesystem";
} & restore;

type restore_commands = restore_azure_storage_account | restore_filesystem;

// Commands
export type commands = backup_commands | restore_commands;
