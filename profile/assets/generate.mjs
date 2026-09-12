// Generates banner-dark.svg and banner-light.svg for the org profile README.
//
//   node profile/assets/generate.mjs
//
// No dependencies. Fonts are subsetted woff2 files in ./fonts, inlined as data
// URIs because GitHub serves README images through a proxy that blocks external
// font fetches — an SVG has to carry its own type or fall back to system fonts.
//
// If you change TAGLINE or WORDMARK to use characters outside the current
// subsets, re-subset the fonts from newHome's copies (needs fonttools):
//
//   pyftsubset syne-latin-700-normal.woff2 --text="JezzWTF" \
//     --flavor=woff2 --layout-features='' --no-hinting --desubroutinize \
//     --output-file=fonts/syne-700.woff2
//
// The mono subset currently covers: a-z A-Z 0-9 and  · . , : ; - / _ ' & + ( )

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// --- content ---------------------------------------------------------------

const WORDMARK = ["Jezz", "WTF"]; // second half takes the accent colour
const TAGLINE = "rebuilding the things i used to pay for";
const FOOTER = "jezz.wtf";
const HUB_LABEL = "api";

// --- palette ---------------------------------------------------------------
//
// Derived from newHome/app/globals.css. Its tokens are oklch, so oklchToHex()
// below converts them — e.g. the dark accent is oklch(0.78 0.16 65). The two
// background stops are hand-tuned rather than straight token conversions: the
// raw --background sits darker than GitHub's canvas and read as a hole.

const themes = {
  dark: {
    bg0: "#05070c", // hand-tuned, near --background
    bg1: "#0b0e14",
    fg: "#eae8e1", // --foreground
    accent: "#fc9f30", // --primary
    muted: "#79818d", // --muted-foreground
    line: "#232830", // --border, lifted slightly
    grid: "#ffffff",
    gridOp: 0.035,
    glowOp: 0.14,
  },
  light: {
    bg0: "#f7f5ee", // --background
    bg1: "#fefcf4", // --card
    fg: "#1d1406", // --foreground
    accent: "#006861", // --primary
    muted: "#6c6250", // --muted-foreground
    line: "#ddd9cc", // --border
    grid: "#1d1406",
    gridOp: 0.05,
    glowOp: 0.1,
  },
};

// oklch(L C H) -> #rrggbb, for pasting tokens straight out of globals.css.
export function oklchToHex(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    "#" +
    lin
      .map((v) => {
        const g = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(1, g)) * 255)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

// --- geometry --------------------------------------------------------------
//
// The motif is the architecture: one api hub, many clients wired to it.
// Each satellite is [dx, dy, radius] relative to the hub.

const hub = { x: 955, y: 150 };
const sats = [
  [-118, -58, 6],
  [6, -116, 5],
  [120, -52, 6.5],
  [112, 58, 5],
  [-14, 118, 6],
  [-120, 52, 5.5],
];

// --- render ----------------------------------------------------------------

const font = (file) => readFileSync(join(here, "fonts", file)).toString("base64");
const syne = font("syne-700.woff2");
const mono = font("jetbrains-mono-400.woff2");

function render(t) {
  const nodes = sats
    .map(([dx, dy, r], i) => {
      const x = hub.x + dx;
      const y = hub.y + dy;
      return `    <line x1="${hub.x}" y1="${hub.y}" x2="${x}" y2="${y}" stroke="${t.accent}" stroke-width="1" opacity=".28"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${t.accent}" opacity=".75">
      <animate attributeName="opacity" values=".75;.3;.75" dur="4.5s" begin="${(i * 0.55).toFixed(2)}s" repeatCount="indefinite"/>
    </circle>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-label="${WORDMARK.join("")} — ${TAGLINE}">
  <defs>
    <style>
      @font-face{font-family:'JWSyne';font-weight:700;src:url(data:font/woff2;base64,${syne}) format('woff2')}
      @font-face{font-family:'JWMono';font-weight:400;src:url(data:font/woff2;base64,${mono}) format('woff2')}
      .mark{font-family:'JWSyne',ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:78px;letter-spacing:-2px}
      .sub{font-family:'JWMono',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:19px;letter-spacing:.2px}
      .tag{font-family:'JWMono',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:15px;letter-spacing:1.4px}
      .lbl{font-family:'JWMono',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:15px;letter-spacing:.5px}
    </style>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg0}"/><stop offset="1" stop-color="${t.bg1}"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${t.accent}" stop-opacity="${t.glowOp}"/>
      <stop offset="1" stop-color="${t.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.4" cy="1.4" r="1.3" fill="${t.grid}" opacity="${t.gridOp}"/>
    </pattern>
    <clipPath id="round"><rect width="1200" height="300" rx="18"/></clipPath>
  </defs>

  <g clip-path="url(#round)">
    <rect width="1200" height="300" fill="url(#bg)"/>
    <rect width="1200" height="300" fill="url(#dots)"/>
    <rect x="655" y="-150" width="600" height="600" fill="url(#glow)"/>

    <!-- architecture motif: one hub, many clients -->
    <circle cx="${hub.x}" cy="${hub.y}" r="132" fill="none" stroke="${t.line}" stroke-width="1"/>
    <circle cx="${hub.x}" cy="${hub.y}" r="132" fill="none" stroke="${t.accent}" stroke-width="1" opacity=".22"
            stroke-dasharray="3 9"/>
${nodes}
    <circle cx="${hub.x}" cy="${hub.y}" r="34" fill="${t.bg0}" stroke="${t.accent}" stroke-width="1.5"/>
    <text class="lbl" x="${hub.x}" y="${hub.y + 5}" fill="${t.accent}" text-anchor="middle">${HUB_LABEL}</text>

    <!-- wordmark -->
    <text class="mark" x="72" y="152" fill="${t.fg}">${WORDMARK[0]}<tspan fill="${t.accent}">${WORDMARK[1]}</tspan></text>
    <rect x="74" y="176" width="176" height="2" fill="url(#rule)"/>
    <text class="sub" x="74" y="214" fill="${t.muted}">${TAGLINE}</text>
    <text class="tag" x="74" y="252" fill="${t.accent}" opacity=".85">${FOOTER}</text>

    <rect y="297" width="1200" height="3" fill="url(#rule)"/>
    <rect width="1200" height="300" rx="18" fill="none" stroke="${t.line}" stroke-width="2"/>
  </g>
</svg>
`;
}

for (const [name, theme] of Object.entries(themes)) {
  const file = join(here, `banner-${name}.svg`);
  writeFileSync(file, render(theme));
  console.log(`wrote banner-${name}.svg`);
}
