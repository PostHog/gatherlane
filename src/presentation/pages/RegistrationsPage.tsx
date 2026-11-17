import type { Registration } from "../../domain";
import { app } from "../../composition";
import { formatDate } from "../formatDate";

export function RegistrationsPage({
  registrations,
  onCancel,
}: {
  registrations: Registration[];
  onCancel: (id: string) => void;
}) {
  return (
    <section className="section">
      <span className="eyebrow dark">Your plans, all in one place</span>
      <h1>My registrations</h1>
      <p>These registrations are stored on this device only.</p>
      {registrations.length ? (
        <div className="booking-list">
          {registrations.map((r) => {
            const e = app.events.find((x) => x.id === r.eventId);
            return (
              <article className="booking" key={r.id}>
                <div>
                  <span className="category">{e?.category || "Event"}</span>
                  <h3>{e?.title || "Event no longer available"}</h3>
                  <p>
                    {e &&
                      `${formatDate({ ...e, date: r.eventDate })} at ${e.time} · ${e.location}`}
                  </p>
                  <p>
                    {r.name} · {r.quantity}{" "}
                    {r.quantity === 1 ? "ticket" : "tickets"}
                    <br />
                    Reference: {r.id}
                  </p>
                </div>
                <button className="outline" onClick={() => onCancel(r.id)}>
                  Cancel registration
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <h3>No registrations yet</h3>
          <p>When you register for an event, you’ll find it here.</p>
          <a className="button" href="#/">
            Explore events
          </a>
        </div>
      )}
    </section>
  );
}
