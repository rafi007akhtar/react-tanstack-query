import { ResError } from "../models/common.model";
import httpConstants from "./constants.util";

export async function fetchEvents(searchTerm?: string, options?: any) {
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
