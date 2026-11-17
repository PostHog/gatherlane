import type { Event, Registration } from "../../domain";
import { remaining } from "../../domain";
import { RegistrationPanel } from "../components/RegistrationPanel";
import { formatDate } from "../formatDate";

type Props = {
  event: Event;
  registrations: Registration[];
  saved: boolean;
  storageError: boolean;
  onToggle: () => void;
  action: (fn: () => void) => void;
};
export function EventDetailPage({
  event,
  registrations,
  saved,
  storageError,
  onToggle,
  action,
}: Props) {
  return (
    <section className="section detail">
      <a className="back" href="#/">
        ← All events
      </a>
      <div className="detail-grid">
        <div>
          <span className="category">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="lead">{event.description}</p>
          <div className="facts">
            <div>
              <small>Date & time</small>
              <strong>
                {formatDate(event)} at {event.time}
              </strong>
              <span>Local time on this device</span>
            </div>
            <div>
              <small>Location</small>
              <strong>{event.location}</strong>
            </div>
            <div>
              <small>Tickets</small>
              <strong>Free</strong>
              <span>
                {remaining(event, registrations)} of {event.capacity} places
                available on this device
              </span>
            </div>
          </div>
          <button className="outline" onClick={() => onToggle()}>
            {saved ? "♥ Saved — remove" : "♡ Save event"}
          </button>
        </div>
        <RegistrationPanel
          event={event}
          registrations={registrations}
          storageError={storageError}
          action={action}
        />
      </div>
    </section>
  );
}
