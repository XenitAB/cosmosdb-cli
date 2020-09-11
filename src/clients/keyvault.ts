/* istanbul ignore file */
// Haven't included a way to mock Azure Key Vault, which means this won't be tested as of now.
// TODO: Add Azure KeyVault Emulator and build end-to-end test using it
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import logger from "./logger";

export const get_keyvault_secret = (
  keyvault_name: string,
  secret_name: string
): Promise<string> => {
  const azure_credential = new DefaultAzureCredential();
  const url = `https://${keyvault_name}.vault.azure.net`;
  const keyvault_client = new SecretClient(url, azure_credential);
  return keyvault_client.getSecret(secret_name).then((secret) => {
    logger.info({
      location: "Keyvault_client.get_keyvault_secret",
      msg: "Extracted secret",
      keyvault_name,
      secret_name,
    });
    if (secret.value != null) {
      return secret.value;
    } else {
      throw new Error(`Secret not found: ${secret_name}`);
    }
  });
};
