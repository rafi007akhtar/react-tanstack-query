interface ErrorInfo {
  message: string;
}

export interface EventInfo {
  id: string;
  date: string | Date;
  image: string;
  title: string;
  location: string;
}

export interface EventInfoWrapper {
  event: EventInfo;
}

export interface ResError extends Error {
  code?: number;
  info?: ErrorInfo;
}
