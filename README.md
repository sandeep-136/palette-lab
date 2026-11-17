# Palette Lab

A small browser-based color studio for exploring palettes and taking them straight into a project.

A project by Sandeep Sagar

## What it does

- Generates five-color analogous, complementary, and monochrome palettes.
- Locks individual swatches while generating new combinations.
- Lets you edit any swatch with the native color picker and copy its hex value.
- Shows a live sample layout with the current colors.
- Calculates WCAG contrast ratios for any pair of colors, with the AA normal-text threshold of 4.5:1.
- Exports the palette as CSS custom properties, by clipboard or file download.
- Saves the current palette and locks in this browser. Includes undo and a reset.
- Supports keyboard navigation, Space to generate, reduced motion, and mobile layouts.

## Run locally

Requires Node.js 18 or newer. No packages to install.

```sh
npm start
```

Open http://localhost:3000.

```sh
npm test
npm run build
```

The build copies the five public assets into `dist/`, ready for static hosting. No backend, account, API key, or database is needed. The UI is written in HTML, CSS, and JavaScript modules. The tiny Node server is only for local development.

## Project map

- `index.html`: semantic layout and controls
- `style.css`: custom responsive styling
- `app.js`: palette editor, preview, storage, and export
- `color.js`: HSL conversion, luminance, contrast, generation, CSS serialization
- `color.test.js`: Node's built-in test runner
- `build.mjs`: static build

## Design and limits

The opening palette uses muted greens and warm neutrals. Generated palettes use harmony offsets in HSL with a fixed lightness progression; they are starting points, not guarantees of accessibility. The contrast checker evaluates only the selected text/background pair, not the entire sample layout. Clipboard access depends on browser permissions and a secure context, so a CSS download is offered as a fallback. The site stores only palette choices in localStorage and sends no palette data to a server. Google Fonts provides optional typography; system fonts work if it is unavailable. Undo history is kept only for the current tab session.

## Deploy on Render

Create a Static Site from this repository. Build command: `npm run build`. Publish directory: `dist`. No environment variables required.
