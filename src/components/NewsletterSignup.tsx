import { useId, useState, type FormEvent } from 'react';

type Props = {
  className?: string;
};

/**
 * Client-side placeholder for a future provider API.
 * Wire `onSubmit` to your endpoint or serverless function when ready.
 */
export default function NewsletterSignup({ className = '' }: Props) {
  const id = useId();
  const emailId = `${id}-email`;
  const [status, setStatus] = useState<'idle' | 'queued'>('idle');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('queued');
    // Intentionally no network call yet — swap for fetch() to your API.
  }

  return (
    <section
      className={[
        'rounded-sm border border-refuge-border bg-refuge-elevated p-5 shadow-panel',
        className,
      ].join(' ')}
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`} className="font-mono text-base font-semibold text-refuge-fg">
        Field reports (newsletter)
      </h2>
      <p className="mt-2 font-serif text-sm leading-snug text-refuge-muted">
        Infrequent updates: releases, readings, and log milestones. No third-party embeds in this
        template—connect your own endpoint when you are ready.
      </p>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-3">
          <div className="grid gap-1">
            <label htmlFor={emailId} className="font-mono text-[11px] uppercase tracking-[0.18em] text-refuge-muted">
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="you@domain.com"
              className="w-full rounded-sm border border-refuge-border bg-refuge-bg px-3 py-2 font-mono text-sm text-refuge-fg placeholder:text-refuge-muted/60"
            />
          </div>
          <button
            type="submit"
            className="h-[42px] rounded-sm border border-refuge-border bg-refuge-surface px-4 font-mono text-sm font-medium text-refuge-fg hover:border-refuge-terminal hover:text-refuge-terminal"
          >
            Request access
          </button>
        </div>
        {status === 'queued' ? (
          <p className="font-mono text-[11px] text-refuge-muted" role="status" aria-live="polite">
            Queued locally (demo). Replace the submit handler with your API integration.
          </p>
        ) : null}
      </form>
    </section>
  );
}
