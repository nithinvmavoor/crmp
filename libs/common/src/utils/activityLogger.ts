import fs from "fs";
import path from "path";
import { logger } from "./logger";

type ActivityLog = {
  time: string;
  service: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  ip?: string;
  userAgent?: string;
  user?: {
    userId?: string;
    email?: string;
    role?: string;
  };
};

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const writeActivityLog = (entry: ActivityLog) => {
  try {
    const logDir = process.env.ACTIVITY_LOG_DIR || "logs";
    ensureDir(logDir);

    const fileName = process.env.ACTIVITY_LOG_FILE || "user-activity.logger";
    const filePath = path.join(logDir, fileName);

    // JSONL format -> 1 JSON object per line
    fs.appendFileSync(filePath, JSON.stringify(entry) + "\n");
  } catch (err: any) {
    // fallback to console
    logger("error", "Failed writing activity logger", { errorMessage: err.message });
  }
};
