import type { Event } from "../../domain";
import { formatDate } from "../formatDate";

type Props = { event: Event; saved: boolean; onToggle: (id: string) => void };

export function EventCard({ event: e, saved, onToggle }: Props) {
  return (
    <article className="card" key={e.id}>
      <div className="card-top">
        <span className="category">{e.category}</span>
        <button
          className="save"
          onClick={() => onToggle(e.id)}
          aria-label={`${saved ? "Unsave" : "Save"} ${e.title}`}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <a className="card-title" href={`#/events/${e.id}`}>
        {e.title}
      </a>
      <p>{e.description}</p>
      <div className="card-meta">
        <strong>
          {formatDate(e)} · {e.time}
        </strong>
        <span>{e.location}</span>
      </div>
      <div className="card-foot">
        <span>Free</span>
        <a href={`#/events/${e.id}`}>
          Event details <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
