import {
  CURSOR_BLINK_CYCLES,
  CURSOR_BLINK_TOTAL_MS,
  ELLIPSIS_BLINK_CYCLES,
  ELLIPSIS_BLINK_TOTAL_MS,
  EMPTY_PAGE_MS,
  FADE_MAIN_FOOTER_MS,
  PAUSE_AFTER_DATE_MS,
  PAUSE_AFTER_HEADER_REMAINDER_MS,
  PAUSE_AFTER_STABLE_MS,
  TERMINAL_LOAD_STORAGE_KEY,
  TYPE_CONNECTION_MS,
  TYPE_DATE_MS,
  TYPE_HEADER_REMAINDER_MS,
  TYPE_STABLE_MS,
} from '../constants/terminalLoadAnimation';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function localCalendarDay(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateTime(): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  } catch {
    return new Date().toString();
  }
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

function finishAnimation(): void {
  const root = document.documentElement;
  root.removeAttribute('data-terminal-load');
  root.removeAttribute('data-terminal-phase');
  root.removeAttribute('aria-busy');
  try {
    localStorage.setItem(TERMINAL_LOAD_STORAGE_KEY, localCalendarDay());
  } catch {
    /* ignore */
  }

  const shell = document.getElementById('terminal-app-shell');
  if (shell) {
    shell.style.opacity = '';
  }

  document.querySelectorAll<HTMLElement>('.terminal-load-readable-content').forEach((el) => {
    el.classList.remove('terminal-load-hidden');
  });

  document.querySelectorAll<HTMLElement>('[data-terminal-header-typing]').forEach((el) => {
    el.remove();
  });

  document.querySelectorAll<HTMLElement>('[data-terminal-cursor]').forEach((el) => {
    el.remove();
  });

  const mainEl = document.getElementById('main');
  const footerEl = document.getElementById('site-footer');
  const navEl = document.querySelector<HTMLElement>('[data-terminal-header-nav]');
  if (mainEl) {
    mainEl.style.transition = '';
    mainEl.style.opacity = '';
  }
  if (footerEl) {
    footerEl.style.transition = '';
    footerEl.style.opacity = '';
  }
  if (navEl) {
    navEl.style.transition = '';
    navEl.style.opacity = '';
  }
}

async function runSequence(): Promise<void> {
  const root = document.documentElement;
  root.setAttribute('aria-busy', 'true');

  const shell = document.getElementById('terminal-app-shell');
  const headerLeft = document.querySelector<HTMLElement>('[data-terminal-header-left]');
  const headerNav = document.querySelector<HTMLElement>('[data-terminal-header-nav]');
  const headerRight = document.querySelector<HTMLElement>('[data-terminal-header-right]');

  const prefixEl = document.querySelector<HTMLElement>('[data-terminal-connection-prefix]');
  const ellipsisEl = document.querySelector<HTMLElement>('[data-terminal-connection-ellipsis]');
  const stableEl = document.querySelector<HTMLElement>('[data-terminal-connection-stable]');
  const cursorEl = document.querySelector<HTMLElement>('[data-terminal-cursor]');
  const dateEl = document.querySelector<HTMLElement>('[data-terminal-date-typing]');

  const headerReadableLeft = document.querySelector<HTMLElement>('[data-terminal-header-readable-left]');

  if (
    !shell ||
    !headerLeft ||
    !headerNav ||
    !headerRight ||
    !prefixEl ||
    !ellipsisEl ||
    !stableEl ||
    !cursorEl ||
    !dateEl ||
    !headerReadableLeft
  ) {
    finishAnimation();
    return;
  }

  const leftReadableContent = headerReadableLeft.querySelector<HTMLElement>('.terminal-load-readable-content');

  if (!leftReadableContent) {
    finishAnimation();
    return;
  }

  const leftLines = [
    'Municipal archive · terminal access',
    'THE REFUGE',
    'Author site for S.C. Barrus — speculative fiction, filed without ceremony.',
  ];

  /** Empty page */
  root.setAttribute('data-terminal-phase', 'empty');
  await sleep(EMPTY_PAGE_MS);

  /** Connection column + shell visible */
  root.setAttribute('data-terminal-phase', 'connection');

  headerLeft.classList.add('terminal-load-hidden');
  headerRight.classList.remove('terminal-load-hidden');

  prefixEl.textContent = '';
  stableEl.textContent = '';
  ellipsisEl.textContent = '';
  cursorEl.hidden = false;

  await blinkElement(cursorEl, CURSOR_BLINK_CYCLES, CURSOR_BLINK_TOTAL_MS);
  cursorEl.hidden = true;

  await typeText(prefixEl, 'CONNECTION:', TYPE_CONNECTION_MS);

  ellipsisEl.textContent = '...';
  await blinkElement(ellipsisEl, ELLIPSIS_BLINK_CYCLES, ELLIPSIS_BLINK_TOTAL_MS);
  ellipsisEl.textContent = '';

  prefixEl.textContent = 'CONNECTION: ';
  await typeText(stableEl, 'STABLE', TYPE_STABLE_MS);

  await sleep(PAUSE_AFTER_STABLE_MS);

  const dateStr = formatDateTime();
  await typeText(dateEl, dateStr, TYPE_DATE_MS);

  await sleep(PAUSE_AFTER_DATE_MS);

  /** Header remainder (left column only; nav fades in with main/footer) */
  root.setAttribute('data-terminal-phase', 'header-remainder');

  headerLeft.classList.remove('terminal-load-hidden');

  leftReadableContent.classList.add('terminal-load-hidden');

  const line1El = leftReadableContent.querySelector<HTMLElement>('[data-terminal-line="1"]');
  const line2El = leftReadableContent.querySelector<HTMLElement>('[data-terminal-line="2"]');
  const line3El = leftReadableContent.querySelector<HTMLElement>('[data-terminal-line="3"]');

  if (!line1El || !line2El || !line3El) {
    finishAnimation();
    return;
  }

  line1El.textContent = '';
  line2El.textContent = '';
  line3El.textContent = '';

  leftReadableContent.classList.remove('terminal-load-hidden');

  const totalChars = leftLines[0].length + leftLines[1].length + leftLines[2].length;
  const totalMs = TYPE_HEADER_REMAINDER_MS;
  const d1 = totalChars > 0 ? (leftLines[0].length / totalChars) * totalMs : 0;
  const d2 = totalChars > 0 ? (leftLines[1].length / totalChars) * totalMs : 0;
  const d3 = totalChars > 0 ? (leftLines[2].length / totalChars) * totalMs : 0;

  await typeText(line1El, leftLines[0], d1);
  await typeText(line2El, leftLines[1], d2);
  await typeText(line3El, leftLines[2], d3);

  await sleep(PAUSE_AFTER_HEADER_REMAINDER_MS);

  /** Fade main + footer */
  root.setAttribute('data-terminal-phase', 'fade');

  const mainEl = document.getElementById('main');
  const footerEl = document.getElementById('site-footer');
  if (!mainEl || !footerEl || !headerNav) {
    finishAnimation();
    return;
  }

  const fadeMs = `${FADE_MAIN_FOOTER_MS}ms ease-out`;
  headerNav.style.transition = `opacity ${fadeMs}`;
  mainEl.style.transition = `opacity ${fadeMs}`;
  footerEl.style.transition = `opacity ${fadeMs}`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      headerNav.style.opacity = '1';
      mainEl.style.opacity = '1';
      footerEl.style.opacity = '1';
    });
  });

  await sleep(FADE_MAIN_FOOTER_MS);

  finishAnimation();
}

export function initTerminalLoad(): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  if (root.getAttribute('data-terminal-load') !== 'run') return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishAnimation();
    return;
  }

  const go = () => void runSequence().catch(() => finishAnimation());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go, { once: true });
  } else {
    go();
  }
}
