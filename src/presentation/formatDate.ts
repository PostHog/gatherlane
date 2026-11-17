import type { Event } from "../domain";

export const formatDate = (e: Event) =>
  new Date(e.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
