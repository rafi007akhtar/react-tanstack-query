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

export interface NewEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

export interface FetchEventOptions {
  id: string | undefined;
  signal: AbortSignal | null | undefined;
}

export interface UpdateEventOptions {
  id: string | undefined;
  event: Event | FormData;
}
