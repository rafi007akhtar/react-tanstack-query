import { QueryClient } from "@tanstack/react-query";
import { FetchEventOptions, ResError } from "../models/common.model";
import httpConstants from "./constants.util";

export const queryClient = new QueryClient();

let eventsBaseURL = `${httpConstants.BASE_URL}/events`;

export async function fetchEvents(searchTerm?: string, options?: any) {
  console.log({ searchTerm, options });

  let url = eventsBaseURL;
  if (searchTerm) {
    url = `${url}?search=${searchTerm}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the events"
    ) as ResError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function fetchEvent(options: FetchEventOptions) {
  const response = await fetch(`${eventsBaseURL}/${options.id}`, {
    signal: options.signal,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the event"
    ) as ResError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function createNewEvent(eventData: any) {
  console.log(eventData);
  const response = await fetch(eventsBaseURL, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while creating the event"
    ) as ResError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent(eventId: string | undefined) {
  const response = await fetch(`${eventsBaseURL}/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting the event"
    ) as ResError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function fetchSelectableImages(params: {
  signal: AbortSignal | null | undefined;
}) {
  const response = await fetch(`${eventsBaseURL}/images`, {
    signal: params.signal,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the images"
    ) as ResError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}
