import { useState } from "react";
import type { Event, Registration } from "../../domain";
import { remaining } from "../../domain";
import { app } from "../../composition";

type Props = {
  event: Event;
  registrations: Registration[];
  storageError: boolean;
  action: (fn: () => void) => void;
};

export function RegistrationPanel({
  event,
  registrations,
  storageError,
  action,
}: Props) {
  const [confirmation, setConfirmation] = useState<Registration>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <aside className="form-panel">
      {confirmation ? (
        <div role="status">
          <span className="category">You’re on the list</span>
          <h2>See you there!</h2>
          <p>Your registration for {event.title} is saved on this device.</p>
          <p>
            <strong>Booking reference</strong>
            <br />
            <span className="reference">{confirmation.id}</span>
          </p>
          <a className="button" href="#/registrations">
            View my registrations
          </a>
        </div>
      ) : (
        <>
          <h2>Join this event</h2>
          <p>
            Free to attend. Your registration stays on this device; no email
            will be sent.
          </p>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              action(() => {
                const result = app.register(event, name, email, quantity);
                setErrors(result.errors);
                if (result.registration) {
                  setConfirmation(result.registration);
                  setName("");
                  setEmail("");
                  setQuantity(1);
                }
              });
            }}
          >
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="field-error">
                  {errors.name}
                </span>
              )}
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field-error">
                  {errors.email}
                </span>
              )}
            </label>
            <label>
              Number of tickets
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                aria-invalid={!!errors.quantity}
                aria-describedby={
                  errors.quantity ? "quantity-error" : undefined
                }
              />
              {errors.quantity && (
                <span id="quantity-error" className="field-error">
                  {errors.quantity}
                </span>
              )}
            </label>
            <button
              className="button"
              disabled={storageError || remaining(event, registrations) === 0}
            >
              Register for free
            </button>
          </form>
          {remaining(event, registrations) === 0 && (
            <p>No places remain on this device.</p>
          )}
        </>
      )}
    </aside>
  );
}
