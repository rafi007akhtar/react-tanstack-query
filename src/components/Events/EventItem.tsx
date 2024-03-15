import { Link } from "react-router-dom";
import { EventInfoWrapper } from "../../models/common.model";
import { formatDate } from "../../util/date.utils";

const EventItem: React.FC<EventInfoWrapper | any> = function ({ event }) {
  const formattedDate = formatDate(event.date);
  return (
    <article className="event-item">
      <img src={`http://localhost:3000/${event.image}`} alt={event.title} />
      <div className="event-item-content">
        <div>
          <h2>{event.title}</h2>
          <p className="event-item-date">{formattedDate}</p>
          <p className="event-item-location">{event.location}</p>
        </div>
        <p>
          <Link to={`/events/${event.id}`} className="button">
            View Details
          </Link>
        </p>
      </div>
    </article>
  );
};

export default EventItem;
