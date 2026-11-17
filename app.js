import {
  validHex,
  generatePalette,
  contrast,
  ink,
  cssTokens,
} from "./color.js";
const original = ["#28483A", "#72917A", "#BECDA5", "#E8EDCF", "#F2E8D5"];
const $ = (id) => document.getElementById(id);
let colors = [...original],
  locked = [false, false, false, false, false],
  history = [],
  toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem("palette-lab"));
  if (saved?.colors?.length === 5 && saved.colors.every(validHex)) {
    colors = saved.colors;
    if (saved.locked?.length === 5) locked = saved.locked.map(Boolean);
  }
} catch {
  /* Storage is optional. */
}
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 2400);
}
async function copy(text, success) {
  try {
    await navigator.clipboard.writeText(text);
    toast(success);
  } catch {
    toast("Clipboard unavailable. Use Download .css instead.");
  }
}
function remember() {
  history.push([...colors]);
  if (history.length > 30) history.shift();
}
function render() {
  $("swatches").replaceChildren(
    ...colors.map((color, i) => {
      const card = document.createElement("div");
      card.className = "swatch";
      card.style.background = color;
      card.style.color = ink(color);
      const num = document.createElement("span");
      num.className = "swatch-num";
      num.textContent = String(i + 1).padStart(2, "0");
      const lock = document.createElement("button");
      lock.className = "lock";
      lock.setAttribute(
        "aria-label",
        `${locked[i] ? "Unlock" : "Lock"} color ${i + 1}`,
      );
      lock.setAttribute("aria-pressed", String(locked[i]));
      lock.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="10" rx="2"/><path d="${locked[i] ? "M8 10V7a4 4 0 0 1 8 0v3" : "M8 10V7a4 4 0 0 1 7-2"}"/><path d="M12 14v3"/></svg>`;
      lock.onclick = () => {
        locked[i] = !locked[i];
        render();
      };
      const hex = document.createElement("button");
      hex.className = "hex";
      hex.textContent = color.toUpperCase();
      hex.setAttribute("aria-label", `Copy ${color.toUpperCase()}`);
      hex.onclick = () => copy(color.toUpperCase(), "Color copied");
      const label = document.createElement("label");
      label.className = "color-edit";
      const picker = document.createElement("input");
      picker.type = "color";
      picker.value = color;
      picker.setAttribute("aria-label", `Edit color ${i + 1}`);
      picker.addEventListener("change", () => {
        remember();
        colors[i] = picker.value;
        render();
      });
      label.append(picker, document.createTextNode("EDIT COLOR"));
      card.append(num, lock, hex, label);
      return card;
    }),
  );
  for (const id of ["foreground", "background"]) {
    const select = $(id);
    const previous = select.value;
    select.replaceChildren(
      ...colors.map((c, i) => {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = `${String(i + 1).padStart(2, "0")} · ${c.toUpperCase()}`;
        return o;
      }),
    );
    select.value = previous || (id === "foreground" ? "0" : "3");
  }
  $("undo").disabled = !history.length;
  $("css-preview").textContent = cssTokens(colors);
  const p = $("preview");
  p.style.background = colors[3];
  p.style.color = ink(colors[3]);
  const btn = $("preview-action");
  btn.style.background = colors[0];
  btn.style.color = ink(colors[0]);
  p.querySelector(".orbit").style.borderColor = colors[1];
  p.querySelector(".orbit div").style.borderColor = colors[2];
  updateContrast();
  try {
    localStorage.setItem("palette-lab", JSON.stringify({ colors, locked }));
  } catch {
    /* Private mode can disable storage. */
  }
}
function updateContrast() {
  const fg = colors[Number($("foreground").value)],
    bg = colors[Number($("background").value)],
    ratio = contrast(fg, bg);
  $("contrast-sample").style.color = fg;
  $("contrast-sample").style.background = bg;
  $("contrast-ratio").textContent = `${ratio.toFixed(2)} : 1`;
  $("contrast-result").textContent =
    ratio >= 4.5 ? "PASS · AA normal text" : "FAIL · AA needs 4.5 : 1";
}
function generate() {
  if (locked.every(Boolean)) {
    toast("Unlock a color to explore a new palette");
    return;
  }
  remember();
  const next = generatePalette($("harmony").value);
  colors = colors.map((c, i) => (locked[i] ? c : next[i]));
  render();
}
$("generate").onclick = generate;
$("harmony").onchange = generate;
$("preview-action").onclick = generate;
$("undo").onclick = () => {
  if (history.length) {
    colors = history.pop();
    render();
  }
};
$("reset").onclick = () => {
  remember();
  colors = [...original];
  locked.fill(false);
  render();
  toast("Back to the original palette");
};
$("foreground").onchange = updateContrast;
$("background").onchange = updateContrast;
$("copy-css").onclick = () => copy(cssTokens(colors), "CSS variables copied");
$("download").onclick = () => {
  const url = URL.createObjectURL(
    new Blob([cssTokens(colors)], { type: "text/css" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "palette-lab.css";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("CSS file downloaded");
};
window.addEventListener("keydown", (event) => {
  if (
    event.code === "Space" &&
    !event.repeat &&
    !["INPUT", "SELECT", "TEXTAREA", "BUTTON", "A"].includes(
      event.target.tagName,
    ) &&
    !event.target.isContentEditable
  ) {
    event.preventDefault();
    generate();
  }
});
render();
