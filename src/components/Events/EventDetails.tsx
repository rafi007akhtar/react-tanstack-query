import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.util.js";
import ErrorBlock from "../UI/ErrorBlock.js";
import { ResError } from "../../models/common.model.js";
import { formatDate } from "../../util/date.utils.js";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // load the event data and display below
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { id }],
    queryFn: (opts) => fetchEvent({ id, signal: opts.signal }),
  });

  // the logic that will implement delete event
  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],

        // make sure after invalidating, the queries are NOT fetched immediately, but only when they are needed next
        // so that 404 error due to GET request for this event does not happen
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  function handleDelete() {
    deleteMutation.mutate(id);
  }

  let content;

  if (isPending) {
    content = (
      <div className="center" id="event-details-content">
        <p>Fetching event data ...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div className="center" id="events-details-content">
        <ErrorBlock
          title="Failed to load event"
          message={
            (error as ResError)?.info?.message ||
            "Failed to fetch event data, please try later"
          }
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = formatDate(data.date);
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>

        <div id="event-details-content">
          {deleteMutation.isPending && <p>Hold on. Deleting this event ...</p>}
          {deleteMutation.isError && (
            <ErrorBlock
              title="Deletion Failed"
              message="Something went wrong with the deletion"
            />
          )}

          <img src={`http://localhost:3000/${data.image}`} alt={data.image} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      <article id="event-details">{content}</article>
    </>
  );
}
