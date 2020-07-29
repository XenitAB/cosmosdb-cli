module.exports = async function () {
  let azuriteProcess = global.__SERVERD__;
  azuriteProcess.stdin.write("q\n");
  azuriteProcess.stdin.pause();
  await azuriteProcess.kill("SIGINT");
  console.log("Azurite stopped");
};
