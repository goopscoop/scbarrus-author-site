import {
  BLACKOUT_FADE_IN_MS,
  BLACKOUT_FADE_OUT_MS,
  BLACKOUT_PRE_FLICKER_MS,
  POST_SHAKE_REEST_BLINK_CYCLES,
  POST_SHAKE_REEST_BLINK_TOTAL_MS,
  POST_SHAKE_REESTABLISHING_TEXT,
  POST_SHAKE_TYPE_REESTABLISH_MS,
  POST_SHAKE_TYPE_STABLE_AGAIN_MS,
  POST_SHAKE_TYPE_UNSTABLE_MS,
  POST_SHAKE_WAIT_MS,
  STABLE_TAP_FIVE,
} from '../constants/terminalLoadAnimation';

const SEQUENCE_ATTR = 'data-refuge-stable-sequence';
/** v2: JSON { "p": 3 | 5, "c": number } */
const STATE_KEY = 'refuge-stable-tap-state';
/** Migrated and removed */
const LEGACY_COUNT_KEY = 'refuge-stable-tap-count';

type PhaseKey = 3 | 5;

const state: { p: PhaseKey; c: number } = { p: 3, c: 0 };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(el: HTMLElement, text: string, durationMs: number): Promise<void> {
  if (durationMs <= 0) {
    el.textContent = text;
    return;
  }
  const n = text.length;
  if (n === 0) {
    el.textContent = '';
    return;
  }
  const start = performance.now();
  return new Promise((resolve) => {
    function frame(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const count = Math.max(0, Math.floor(progress * n));
      el.textContent = text.slice(0, count);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = text;
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

async function blinkElement(
  el: HTMLElement,
  cycles: number,
  totalMs: number,
  visibleClass = 'terminal-load-blink-on',
): Promise<void> {
  if (cycles <= 0 || totalMs <= 0) return;
  const half = totalMs / (cycles * 2);
  for (let i = 0; i < cycles; i++) {
    el.classList.add(visibleClass);
    await sleep(half);
    el.classList.remove(visibleClass);
    await sleep(half);
  }
}

function readState(): void {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (raw) {
      const o = JSON.parse(raw) as { p?: number; c?: number };
      if (o.p === 3 && typeof o.c === 'number' && Number.isInteger(o.c) && o.c >= 0 && o.c < 3) {
        state.p = 3;
        state.c = o.c;
        return;
      }
      if (
        o.p === 5 &&
        typeof o.c === 'number' &&
        Number.isInteger(o.c) &&
        o.c >= 0 &&
        o.c < STABLE_TAP_FIVE
      ) {
        state.p = 5;
        state.c = o.c;
        return;
      }
    }
  } catch {
    /* fall through to migrate */
  }
  try {
    const v = sessionStorage.getItem(LEGACY_COUNT_KEY);
    sessionStorage.removeItem(LEGACY_COUNT_KEY);
    if (v != null) {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n) && n >= 0) {
        state.p = 3;
        state.c = Math.min(2, n);
        writeState();
        return;
      }
    }
  } catch {
    /* ignore */
  }
  state.p = 3;
  state.c = 0;
}

function writeState(): void {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ p: state.p, c: state.c }));
  } catch {
    /* ignore */
  }
}

/** Header + footer skip readouts, same selector order. */
const stableEls = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-refuge-stable-tap]'));
const reestablishWrapEls = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-refuge-reestablish-wrap]'));
const reestablishTextEls = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-refuge-reestablish-text]'));

function setSequenceOn(): void {
  document.documentElement.setAttribute(SEQUENCE_ATTR, '');
}

function setSequenceOff(): void {
  document.documentElement.removeAttribute(SEQUENCE_ATTR);
}

function sequenceIsActive(): boolean {
  return document.documentElement.hasAttribute(SEQUENCE_ATTR);
}

/**
 * Re-establishing line + blink, shared (readout rows or single blackout line).
 * Clears and hides wraps; leaves text el empty when wraps used.
 */
async function runReestablishingLine(
  textEls: HTMLElement[],
  wraps: HTMLElement[],
): Promise<void> {
  if (textEls.length === 0) return;
  for (const w of wraps) w.hidden = false;
  await Promise.all(
    textEls.map((el) =>
      typeText(el, POST_SHAKE_REESTABLISHING_TEXT, POST_SHAKE_TYPE_REESTABLISH_MS),
    ),
  );
  for (const el of textEls) el.classList.add('terminal-load-ellipsis');
  await Promise.all(
    textEls.map((el) =>
      blinkElement(el, POST_SHAKE_REEST_BLINK_CYCLES, POST_SHAKE_REEST_BLINK_TOTAL_MS),
    ),
  );
  for (const el of textEls) {
    el.classList.remove('terminal-load-ellipsis');
    el.textContent = '';
  }
  for (const w of wraps) w.hidden = true;
}

async function runPostShakeSequence(): Promise<void> {
  const stables = stableEls();
  const wraps = reestablishWrapEls();
  const reTexts = reestablishTextEls();

  try {
    if (stables.length > 0) {
      await Promise.all(
        stables.map((el) => typeText(el, 'UNSTABLE', POST_SHAKE_TYPE_UNSTABLE_MS)),
      );
      await sleep(POST_SHAKE_WAIT_MS);
      for (const s of stables) s.textContent = '';
    }
    if (reTexts.length > 0) {
      await runReestablishingLine(reTexts, wraps);
    }
    if (stables.length > 0) {
      await Promise.all(
        stables.map((el) => typeText(el, 'STABLE', POST_SHAKE_TYPE_STABLE_AGAIN_MS)),
      );
    }
    state.p = 5;
    state.c = 0;
    writeState();
  } finally {
    setSequenceOff();
  }
}

function waitFlickerEnd(shell: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const finish = (): void => {
      shell.removeEventListener('animationend', onAnimationEnd);
      shell.classList.remove('refuge-site-flicker');
      resolve();
    };
    const t = setTimeout(finish, Math.max(400, BLACKOUT_PRE_FLICKER_MS + 80));
    const onAnimationEnd = (): void => {
      clearTimeout(t);
      finish();
    };
    shell.addEventListener('animationend', onAnimationEnd, { once: true });
  });
}

function parseMs(el: Element | null, name: string, fallback: number): number {
  if (!el) return fallback;
  const v = el.getAttribute(name);
  if (v == null) return fallback;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

async function runBlackoutSequence(): Promise<void> {
  if (sequenceIsActive()) return;
  setSequenceOn();
  const shell = document.getElementById('terminal-app-shell');
  const blackout = document.querySelector<HTMLElement>('[data-refuge-blackout]');
  const reEl = document.querySelector<HTMLElement>('[data-refuge-blackout-reestablish]');
  const fadeIn = parseMs(blackout, 'data-refuge-blackout-fade-in-ms', BLACKOUT_FADE_IN_MS);
  const fadeOut = parseMs(blackout, 'data-refuge-blackout-fade-out-ms', BLACKOUT_FADE_OUT_MS);
  if (!blackout || !reEl) {
    /* `finally` resets phase and clears the sequence */
    return;
  }

  try {
    if (shell) {
      shell.classList.add('refuge-site-flicker');
      await waitFlickerEnd(shell);
    } else {
      await sleep(BLACKOUT_PRE_FLICKER_MS);
    }

    reEl.textContent = '';
    blackout.removeAttribute('hidden');
    blackout.removeAttribute('inert');
    blackout.setAttribute('aria-hidden', 'false');
    blackout.style.transitionDuration = `${fadeIn}ms`;
    await new Promise<void>((r) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          blackout.classList.remove('opacity-0');
          blackout.classList.add('opacity-100');
        });
      });
      setTimeout(r, fadeIn + 50);
    });

    await typeText(reEl, POST_SHAKE_REESTABLISHING_TEXT, POST_SHAKE_TYPE_REESTABLISH_MS);
    reEl.classList.add('terminal-load-ellipsis');
    await blinkElement(
      reEl,
      POST_SHAKE_REEST_BLINK_CYCLES,
      POST_SHAKE_REEST_BLINK_TOTAL_MS,
    );
    reEl.classList.remove('terminal-load-ellipsis');
    reEl.textContent = '';

    blackout.style.transitionDuration = `${fadeOut}ms`;
    blackout.classList.remove('opacity-100');
    blackout.classList.add('opacity-0');
    await sleep(fadeOut + 100);
    blackout.setAttribute('hidden', '');
    blackout.setAttribute('inert', '');
    blackout.setAttribute('aria-hidden', 'true');
  } finally {
    state.p = 3;
    state.c = 0;
    writeState();
    setSequenceOff();
  }
}

function runShake(): void {
  if (sequenceIsActive()) return;
  setSequenceOn();
  const shell = document.getElementById('terminal-app-shell');
  const grain = document.querySelector<HTMLElement>('.grain-overlay');
  const targets: HTMLElement[] = [shell, grain].filter(
    (e): e is HTMLElement => e != null,
  );
  if (targets.length === 0) {
    void runPostShakeSequence();
    return;
  }
  for (const el of targets) {
    el.classList.add('refuge-site-shake');
  }
  const onEnd = (): void => {
    for (const el of targets) {
      el.classList.remove('refuge-site-shake');
    }
    targets[0]!.removeEventListener('animationend', onEnd);
    void runPostShakeSequence();
  };
  targets[0]!.addEventListener('animationend', onEnd, { once: true });
}

function onTap(): void {
  if (document.documentElement.hasAttribute(SEQUENCE_ATTR)) return;
  const need = state.p === 3 ? 3 : STABLE_TAP_FIVE;
  state.c += 1;
  if (state.c < need) {
    writeState();
    return;
  }
  state.c = 0;
  writeState();
  if (state.p === 3) {
    runShake();
  } else {
    void runBlackoutSequence();
  }
}

export function initStableTap(): void {
  if (typeof document === 'undefined') return;
  readState();

  document.addEventListener('click', (e) => {
    const t = (e.target as Element | null)?.closest('[data-refuge-stable-tap]');
    if (!t) return;
    e.preventDefault();
    onTap();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = (e.target as Element | null)?.closest('[data-refuge-stable-tap]');
    if (!t) return;
    e.preventDefault();
    onTap();
  });
}
