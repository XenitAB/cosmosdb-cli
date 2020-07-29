const { spawn } = require("child_process");

let azuriteProcess;

module.exports = async () => {
  console.log("[Tests Bootstrap] Start");
  await startAzurite().catch((e) => {
    console.error(e);
    return;
  });
  global.__SERVERD__ = azuriteProcess;
};

function startAzurite() {
  azuriteProcess = azuriteProcess = spawn("azurite-blob", ["-l", "/tmp"]);

  return finishLoading();
}

const finishLoading = () =>
  new Promise((resolve, reject) => {
    azuriteProcess.stdout.on("data", (data) => {
      if (data.includes("Azurite Blob service is starting on")) {
        console.log(data.toString().trim());
        console.log(`Azurite started with PID : ${azuriteProcess.pid}`);
        resolve("ok");
      }

      if (data.includes("address already in use")) {
        reject(data.toString().trim());
      }
    });

    azuriteProcess.stderr.on("data", (errData) => {
      console.log(`Error starting Serverless Offline:\n${errData}`);
      reject(errData);
    });
  });
