export const validHex = (value) => /^#[0-9a-f]{6}$/i.test(value);
export function luminance(hex) {
  if (!validHex(hex)) throw new Error("Use a six-digit hex color");
  const c = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
export function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function ink(hex) {
  return contrast(hex, "#ffffff") >= contrast(hex, "#151515")
    ? "#ffffff"
    : "#151515";
}
export function hslHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return "#" + f(0) + f(8) + f(4);
}
export function generatePalette(mode = "analogous", random = Math.random) {
  const h = random() * 360;
  const offsets =
    mode === "complementary"
      ? [0, 12, 180, 194, 0]
      : mode === "monochrome"
        ? [0, 0, 0, 0, 0]
        : [-35, -12, 12, 35, 55];
  return offsets.map((offset, i) =>
    hslHex(
      (h + offset + 360) % 360,
      45 + random() * 22,
      [22, 40, 60, 78, 92][i],
    ),
  );
}
export function cssTokens(colors) {
  return (
    ":root {\n" +
    colors.map((c, i) => `  --color-${i + 1}: ${c.toUpperCase()};`).join("\n") +
    "\n}\n"
  );
}
