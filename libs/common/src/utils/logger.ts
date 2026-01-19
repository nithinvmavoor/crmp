type LogLevel = "info" | "error" | "warn" | "debug";

interface LogMetadata {
  [key: string]: any;
}

export const logger = (level: LogLevel, message: string, additionalData?: LogMetadata) => {
  console.log(
    JSON.stringify({
      level,
      service: process.env.SERVICE_NAME,
      msg: message,
      ...additionalData,
    })
  );
};
