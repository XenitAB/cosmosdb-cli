const { spawn } = require("child_process");

let azuriteProcess;
// let cosmosdbProcess;

module.exports = async () => {
  console.log("[Tests Bootstrap] Start");
  await startAzurite().catch((e) => {
    console.error(e);
    return;
  });
  global.__SERVERD_AZURITE__ = azuriteProcess;

  // await startCosmosdb().catch((e) => {
  //   console.error(e);
  //   return;
  // });
  // global.__SERVERD_COSMOSDB_SERVER__ = cosmosdbProcess;
};

// Azurite
function startAzurite() {
  azuriteProcess = azuriteProcess = spawn("azurite-blob", ["-l", "/tmp"]);

  return finishLoadingAzurite();
}

const finishLoadingAzurite = () =>
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
      console.log(`Error starting Azurite:\n${errData}`);
      reject(errData);
    });
  });

// cosmosdb-server
// function startCosmosdb() {
//   cosmosdbProcess = azuriteProcess = spawn("cosmosdb-server", ["-p", "3000"]);

//   return finishLoadingCosmosdb();
// }

// const finishLoadingCosmosdb = () =>
//   new Promise((resolve, reject) => {
//     cosmosdbProcess.stdout.on("data", (data) => {
//       if (data.includes("Ready to accept connections at")) {
//         console.log(data.toString().trim());
//         console.log(
//           `cosmosdb-server started with PID : ${cosmosdbProcess.pid}`
//         );
//         resolve("ok");
//       }

//       if (data.includes("address already in use")) {
//         reject(data.toString().trim());
//       }
//     });

//     azuriteProcess.stderr.on("data", (errData) => {
//       console.log(`Error starting cosmosdb-server:\n${errData}`);
//       reject(errData);
//     });
//   });
