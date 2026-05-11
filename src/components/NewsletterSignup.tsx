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

  /** Matches `LogTerminal` default (non-inline): green frame, inset shadow, mono / terminal green text. */
  const shell =
    'not-prose border-2 border-green-500/90 bg-zinc-900 p-[60px] font-mono text-sm leading-relaxed text-green-400 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] [text-shadow:none]';

  return (
    <section
      className={[shell, className].filter(Boolean).join(' ')}
      aria-labelledby={`${id}-heading`}
      data-log-terminal
    >
      <div className="[&_p]:m-0 [&_p+p]:mt-3">
        <h2 id={`${id}-heading`} className="m-0 font-mono text-base font-semibold tracking-tight text-green-400">
          INTERCEPT FIELD REPORTS
        </h2>
        <br/>
        <p className="mt-3 font-mono text-sm leading-relaxed text-green-500/90">
          To receive future intercepts (<em>newsletter</em>) and a decrypted copy of archive file <em>'Discovering Aberration'</em> (<em>free ebook</em>), establish a secure uplink below. Updates are infrequent.
        </p>

        <form className="mt-6 grid gap-3" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-3">
            <div className="grid gap-1">
              <label
                htmlFor={emailId}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-green-500/75"
              >
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
                className="w-full border border-green-500/50 bg-black/40 px-3 py-2 font-mono text-sm text-green-300 placeholder:text-green-600/80 outline-none ring-0 focus:border-green-400 focus:ring-1 focus:ring-green-500/40"
              />
            </div>
            <button
              type="submit"
              className="h-[42px] border-2 border-green-500/80 bg-zinc-950/80 px-4 font-mono text-sm font-medium text-green-400 hover:border-green-400 hover:text-green-300"
            >
              EXECUTE
            </button>
          </div>
          {status === 'queued' ? (
            <p className="m-0 font-mono text-[11px] text-green-600" role="status" aria-live="polite">
              Queued locally (demo). Replace the submit handler with your API integration.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
