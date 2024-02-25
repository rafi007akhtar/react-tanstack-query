export interface ResError extends Error {
  code?: number;
  info?: ErrorInfo;
}

interface ErrorInfo {
  message: string;
}
