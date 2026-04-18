import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        refuge: {
          bg: '#000000',
          surface: '#050505',
          elevated: '#0a0a0a',
          border: '#242424',
          muted: '#8f8a82',
          fg: '#e8e4dc',
          /** Dim amber — primary terminal accent for links & hovers */
          terminal: '#ffb000',
          terminalMuted: '#6b4f00',
          /** Status readout (connection line) */
          terminalGreen: '#4AF626',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: [
          '"Source Serif 4"',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        panel: 'inset 0 1px 0 0 rgba(255,255,255,0.03)',
      },
      maxWidth: {
        /** Primary reading column */
        measure: '34rem',
        /** Main page gutter / header width — 800px cap on wide viewports */
        content: '800px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            a: {
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
