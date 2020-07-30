module.exports = async function () {
  // Azurite
  let azuriteProcess = global.__SERVERD_AZURITE__;
  azuriteProcess.stdin.write("q\n");
  azuriteProcess.stdin.pause();
  await azuriteProcess.kill("SIGINT");
  console.log("Azurite stopped");

  // cosmosdb-server
  let cosmosdbProcess = global.__SERVERD_COSMOSDB_SERVER__;
  cosmosdbProcess.stdin.write("q\n");
  cosmosdbProcess.stdin.pause();
  await cosmosdbProcess.kill("SIGINT");
  console.log("cosmosdb-server stopped");
};
