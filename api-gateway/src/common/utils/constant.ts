import { stat } from "fs/promises";

export const INGESTION_SERVICE_NAME = "INGESTION_SERVICE";

export interface IngestionResponse {
  message: string;
  ingestion: {
    id: string;
    documentId: string;
    userId: string;
    status: string;
    ingestedAt: string;
  };
}

export const getSizeOfDocument = async (path: string) => {
  const stats = await stat(path);
  const size = stats.size;
  return convertBytes(size);
}

export function convertBytes(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB"];

  if (bytes === 0) {
    return "n/a";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i == 0) {
    return bytes + " " + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
