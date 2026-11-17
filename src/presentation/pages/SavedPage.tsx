import type { ReactNode } from "react";
import type { Event } from "../../domain";
import { app } from "../../composition";

export function SavedPage({
  saved,
  card,
}: {
  saved: string[];
  card: (event: Event) => ReactNode;
}) {
  return (
    <section className="section">
      <span className="eyebrow dark">Keep the good ones close</span>
      <h1>Saved events</h1>
      <p>Events you save are stored on this device.</p>
      <div className="grid">
        {app.events.filter((e) => saved.includes(e.id)).map(card)}
      </div>
      {!saved.length && (
        <div className="empty">
          <h3>Nothing saved yet</h3>
          <p>Save an event to find it here later.</p>
          <a className="button" href="#/">
            Explore events
          </a>
        </div>
      )}
    </section>
  );
}
