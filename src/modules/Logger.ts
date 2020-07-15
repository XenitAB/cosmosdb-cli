import * as winston from "winston";

const logger = winston.createLogger({
  level: "debug", // Levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
