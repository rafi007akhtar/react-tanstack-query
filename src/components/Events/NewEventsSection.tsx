import { Key } from "react";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { ResError } from "src/models/common.model.js";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.util.js";

export default function NewEventsSection() {
  let { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    // staleTime: 5000, // data will be considered state after fetching in this much time (ms)
    // gcTime: 1000, // fetched data will be cleared from the cache (garbage-collected) after this much time (ms)
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={(error as ResError).info?.message || "Failed to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event: { id: Key | null | undefined }) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
