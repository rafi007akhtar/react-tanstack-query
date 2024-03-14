import { QueryClient } from "@tanstack/react-query";
import { ResError } from "../models/common.model";
import httpConstants from "./constants.util";

export const queryClient = new QueryClient();

export async function fetchEvents(searchTerm?: string, options?: any) {
  console.log({ searchTerm, options });

  let url = `${httpConstants.BASE_URL}/events`;
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

export async function createNewEvent(eventData: any) {
  console.log(eventData);
  const response = await fetch(`http://localhost:3000/events`, {
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

export async function fetchSelectableImages(params: {
  signal: AbortSignal | null | undefined;
}) {
  const response = await fetch(`http://localhost:3000/events/images`, {
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
