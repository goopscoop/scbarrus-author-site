import { useId, useState, useRef, type FormEvent } from 'react';

type Props = {
  className?: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const KIT_FORM_ID = '9501653';
const PUBLIC_API_KEY = 'Wff2Kd6c8zFssfPkZWcFZw';

export default function NewsletterSignup({ className = '' }: Props) {
  const id = useId();
  const emailId = `${id}-email`;
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value ?? '';
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(
  `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: KIT_FORM_ID,
      api_key: PUBLIC_API_KEY,
      email: email,
    }),
  }
);

      if (!res.ok) throw new Error('Transmission failed.');
      setStatus('success');
    } catch (err) {
      setErrorMessage('Transmission failed. Check your coordinates and try again.');
      setStatus('error');
    }
  }

  const shell =
    'not-prose border-2 border-green-500/90 bg-zinc-900 p-[60px] font-mono text-sm leading-relaxed text-green-400 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] [text-shadow:none]';

  return (
    <section
      className={[shell, className].filter(Boolean).join(' ')}
      aria-labelledby={`${id}-heading`}
      data-log-terminal
    >
      <div className="[&_p]:m-0 [&_p+p]:mt-3">
        <h2
          id={`${id}-heading`}
          className="m-0 font-mono text-base font-semibold tracking-tight text-green-400"
        >
          INTERCEPT FIELD REPORTS
        </h2>
        <br />

        {status === 'success' ? (
          <div role="status" aria-live="polite">
            <p className="font-mono text-sm leading-relaxed text-green-500/90">
              // UPLINK REQUEST RECEIVED
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-green-500/90">
              Check your terminal access point for a confirmation request. The archive
              awaits your response.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-3 font-mono text-sm leading-relaxed text-green-500/90">
              To receive future intercepts, establish a secure uplink below. The
              intercepts transmit only when the signal is worth the noise.
            </p>

            <form className="mt-6 grid gap-3" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-1">
                <label
                  htmlFor={emailId}
                  className="font-mono mb-2 text-[11px] uppercase tracking-[0.18em] text-green-500/75"
                >
                  Email
                </label>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
                  <input
                    ref={emailRef}
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    disabled={status === 'loading'}
                    placeholder="you@domain.com"
                    className="box-border h-10 w-full min-w-0 border border-green-500/50 bg-black/40 px-3 py-0 font-mono text-sm leading-10 text-green-300 placeholder:text-green-600/80 outline-none ring-0 focus:border-green-400 focus:ring-1 focus:ring-inset focus:ring-green-500/40 disabled:opacity-50 sm:flex-1 sm:border-r-0"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="relative z-10 box-border flex h-10 w-full shrink-0 items-center justify-center border-2 border-green-500/80 bg-zinc-950/80 px-4 font-mono text-sm font-medium text-green-400 hover:border-green-400 hover:text-green-300 disabled:opacity-50 sm:w-auto"
                  >
                    {status === 'loading' ? 'CONNECTING...' : 'EXECUTE'}
                  </button>
                </div>
              </div>

              {status === 'error' && (
                <p
                  className="m-0 font-mono text-[11px] text-red-400"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
}