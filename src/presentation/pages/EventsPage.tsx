import { useState } from "react";
import type { ReactNode } from "react";
import type { Event } from "../../domain";
import { app } from "../../composition";

export function EventsPage({ card }: { card: (event: Event) => ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">Good things happen together</span>
          <h1>
            Find your people.
            <br />
            Make a little time.
          </h1>
          <p>
            From garden mornings to shared tables, there’s something happening
            around the corner.
          </p>
          <button
            className="button light"
            onClick={() => document.getElementById("events")?.scrollIntoView()}
          >
            Explore events <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun">✳</div>
          <div className="art-text">
            A little more
            <br />
            <em>together.</em>
          </div>
          <div className="art-bottom">Gather here. &nbsp; Stay curious.</div>
        </div>
      </section>
      <section id="events" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">Your community calendar</span>
            <h2>Come on out.</h2>
          </div>
          <p>Find a little something for your week.</p>
        </div>
        <div className="filters">
          <label>
            Search events
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try a title, place, or keyword"
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["All", ...new Set(app.events.map((e) => e.category))].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </label>
        </div>
        <p className="results">
          {app.search(query, category).length} events to explore
        </p>
        <div className="grid">{app.search(query, category).map(card)}</div>
        {!app.search(query, category).length && (
          <div className="empty">
            <h3>No events found</h3>
            <p>Try another search or category.</p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
