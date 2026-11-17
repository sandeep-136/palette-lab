import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validHex,
  luminance,
  contrast,
  ink,
  hslHex,
  generatePalette,
  cssTokens,
} from "./color.js";
test("validates full-length hex values", () => {
  assert.ok(validHex("#abcdef"));
  assert.ok(!validHex("#fff"));
  assert.ok(!validHex("red"));
});
test("black and white luminance", () => {
  assert.equal(luminance("#000000"), 0);
  assert.equal(luminance("#ffffff"), 1);
});
test("reference contrast ratio is 21:1", () =>
  assert.equal(contrast("#000000", "#ffffff"), 21));
test("identical colors have contrast 1", () =>
  assert.equal(contrast("#28483a", "#28483a"), 1));
test("contrast is symmetric", () =>
  assert.equal(contrast("#123456", "#abcdef"), contrast("#abcdef", "#123456")));
test("readable swatch labels", () => {
  assert.equal(ink("#000000"), "#ffffff");
  assert.equal(ink("#ffffff"), "#151515");
});
test("HSL conversion primaries", () => {
  assert.equal(hslHex(0, 100, 50), "#ff0000");
  assert.equal(hslHex(120, 100, 50), "#00ff00");
  assert.equal(hslHex(240, 100, 50), "#0000ff");
});
test("all harmony modes generate valid colors", () => {
  for (const mode of ["analogous", "complementary", "monochrome"])
    for (let i = 0; i < 100; i++) {
      const colors = generatePalette(mode);
      assert.equal(colors.length, 5);
      assert.ok(colors.every(validHex));
    }
});
test("deterministic generation can be tested", () =>
  assert.deepEqual(
    generatePalette("analogous", () => 0.5),
    generatePalette("analogous", () => 0.5),
  ));
test("CSS export includes all five values", () => {
  const css = cssTokens([
    "#000000",
    "#111111",
    "#222222",
    "#333333",
    "#ffffff",
  ]);
  assert.ok(css.startsWith(":root {"));
  assert.ok(css.includes("--color-5: #FFFFFF;"));
});
test("invalid colors cannot silently pass contrast", () =>
  assert.throws(() => contrast("red", "#ffffff")));
