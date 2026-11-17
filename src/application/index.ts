import { remaining, validate } from "../domain";
import type { Event, Registration } from "../domain";
export interface Repository {
  read(): { saved: string[]; registrations: Registration[] };
  write(data: { saved: string[]; registrations: Registration[] }): void;
}
export function createApp(events: Event[], repo: Repository) {
  return {
    events,
    read: () => repo.read(),
    search: (query: string, category: string) =>
      events.filter(
        (e) =>
          (category === "All" || e.category === category) &&
          `${e.title} ${e.description} ${e.location}`
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
      ),
    toggle: (id: string) => {
      const data = repo.read();
      data.saved = data.saved.includes(id)
        ? data.saved.filter((x) => x !== id)
        : [...data.saved, id];
      repo.write(data);
    },
    register: (event: Event, name: string, email: string, quantity: number) => {
      const data = repo.read();
      const errors = validate(
        name,
        email,
        quantity,
        remaining(event, data.registrations),
      );
      if (
        data.registrations.some(
          (r) =>
            r.eventId === event.id &&
            r.eventDate === event.date &&
            r.email.toLowerCase() === email.trim().toLowerCase(),
        )
      )
        errors.email =
          "This email is already registered for this event on this device.";
      if (Object.keys(errors).length) return { errors };
      const registration = {
        id: crypto.randomUUID(),
        eventId: event.id,
        eventDate: event.date,
        name: name.trim(),
        email: email.trim(),
        quantity,
      };
      data.registrations.push(registration);
      repo.write(data);
      return { errors, registration };
    },
    cancel: (id: string) => {
      const data = repo.read();
      data.registrations = data.registrations.filter((r) => r.id !== id);
      repo.write(data);
    },
  };
}
