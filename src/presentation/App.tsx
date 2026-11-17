import React, { useState } from "react";
import { app } from "../composition";
import { clearStorage } from "../infrastructure/storage";
import type { Event, Registration } from "../domain";
import "./style.css";
import { EventsPage } from "./pages/EventsPage";
import { SavedPage } from "./pages/SavedPage";
import { RegistrationsPage } from "./pages/RegistrationsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { EventCard } from "./components/EventCard";
export function App() {
  const [path, setPath] = useState(location.hash.slice(1) || "/");
  const [data, setData] = useState<{
    saved: string[];
    registrations: Registration[];
  }>({ saved: [], registrations: [] });
  const [error, setError] = useState("");
  const refresh = () => {
    try {
      setData(app.read());
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  React.useEffect(() => {
    refresh();
    const change = () => {
      setPath(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const action = (fn: () => void) => {
    try {
      fn();
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const event = app.events.find((e) => path === `/events/${e.id}`);
  const card = (event: Event) => (
    <EventCard
      key={event.id}
      event={event}
      saved={data.saved.includes(event.id)}
      onToggle={(id) => action(() => app.toggle(id))}
    />
  );
  return (
    <>
      <header>
        <div className="nav wrap">
          <a className="brand" href="#/">
            <svg width="35" height="35" viewBox="0 0 36 36" aria-hidden="true">
              <rect width="36" height="36" rx="11" fill="#d8ec7a" />
              <path
                d="M8 23c4-10 6-10 10 0 4-10 6-10 10 0"
                fill="none"
                stroke="#173f35"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>{" "}
            gatherlane
          </a>
          <nav aria-label="Main navigation">
            <a href="#/" aria-current={path === "/" ? "page" : undefined}>
              Events
            </a>
            <a
              href="#/saved"
              aria-current={path === "/saved" ? "page" : undefined}
            >
              Saved events
            </a>
            <a
              href="#/registrations"
              aria-current={path === "/registrations" ? "page" : undefined}
            >
              My registrations
            </a>
          </nav>
        </div>
      </header>
      <main className="wrap">
        {error && (
          <div className="alert" role="alert">
            {error}{" "}
            {error.startsWith("Saved data") && (
              <button
                onClick={() => {
                  try {
                    clearStorage();
                    refresh();
                  } catch {
                    setError(
                      "Could not clear browser storage. Check your browser settings.",
                    );
                  }
                }}
              >
                Clear Gatherlane data
              </button>
            )}
          </div>
        )}
        {path === "/" ? (
          <EventsPage card={card} />
        ) : path === "/saved" ? (
          <SavedPage saved={data.saved} card={card} />
        ) : path === "/registrations" ? (
          <RegistrationsPage
            registrations={data.registrations}
            onCancel={(id) => action(() => app.cancel(id))}
          />
        ) : event ? (
          <EventDetailPage
            key={event.id}
            event={event}
            registrations={data.registrations}
            saved={data.saved.includes(event.id)}
            storageError={!!error}
            onToggle={() => action(() => app.toggle(event.id))}
            action={action}
          />
        ) : (
          <section className="section empty">
            <h1>We couldn’t find that page.</h1>
            <p>Let’s get you back to the neighborhood.</p>
            <a className="button" href="#/">
              Browse events
            </a>
          </section>
        )}
      </main>
      <footer>
        <div className="wrap footer">
          <strong>gatherlane</strong>
          <p>Made for making plans together.</p>
          <p>
            Saved events and registrations stay on this device. Availability is
            local, not shared.
          </p>
        </div>
      </footer>
    </>
  );
}
