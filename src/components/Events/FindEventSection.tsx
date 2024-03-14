import { useQuery } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react";
import { fetchEvents } from "../../util/http.util";
import ErrorBlock from "../UI/ErrorBlock";
import { EventInfo, ResError } from "../../models/common.model";
import LoadingIndicator from "../UI/LoadingIndicator";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const searchElement = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>();

  const {
    data,
    // isPending, // will be true if the enabled condition is false
    isLoading, // will not be true if enabled condition is false
    isError,
    error,
  } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: (opts) => fetchEvents(searchTerm, opts),
    enabled: searchTerm !== undefined,
  });
  // NOTE: useQuery hook fires the get function immediately during definition, unlike useMutation

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const enteredText = searchElement.current?.value as string;
    setSearchTerm(enteredText);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occured"
        message={(error as ResError).info?.message || "Failed to fetch events"}
      />
    );
  }

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (data) {
    content = (
      <ul>
        {data.map((event: EventInfo) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>

      {content}
    </section>
  );
}
