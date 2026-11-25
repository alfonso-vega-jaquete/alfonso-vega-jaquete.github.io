{
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const fmt = (v, d = 1) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(d);

  function lineChart(box) {
    const src = document.getElementById(box.dataset.src);
    if (!src) return;
    const data = JSON.parse(src.textContent);
    const svg = el("svg", { role: "img", "aria-label": box.dataset.label || "", tabindex: "0" });
    box.appendChild(svg);
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("aria-hidden", "true");
    box.appendChild(tip);
    const n = data.x.length;
    let idx = n - 1, sx, sy, W, H, m, hair, dots = [];

    const draw = () => {
      W = box.clientWidth; H = box.clientHeight;
      if (!W || !H) return;
      const narrow = W < 520;
      m = { l: 34, r: narrow ? 80 : 84, t: 26, b: 30 };
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.textContent = "";
      const x0 = data.x[0], x1 = data.x[n - 1];
      sx = v => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
      sy = v => m.t + (data.yMax - v) / (data.yMax - data.yMin) * (H - m.t - m.b);
      for (const t of data.yTicks) {
        el("line", { class: "grid", x1: m.l, x2: W - m.r, y1: sy(t), y2: sy(t) }, svg);
        el("text", { class: "tick", x: m.l - 8, y: sy(t) + 4, "text-anchor": "end" }, svg).textContent = t;
      }
      const step = narrow ? 4 : 2;
      for (const v of data.x) {
        if ((v - x0) % step) continue;
        el("text", { class: "tick", x: sx(v), y: H - m.b + 19, "text-anchor": "middle" }, svg).textContent = v;
      }
      el("line", { class: "axis", x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }, svg);
      if (data.marker) {
        const mx = sx(data.marker.x);
        el("line", { class: "treat", x1: mx, x2: mx, y1: m.t - 10, y2: H - m.b }, svg);
        el("text", { class: "treat-lab", x: mx + 6, y: m.t - 1 }, svg).textContent = narrow ? data.marker.short : data.marker.label;
      }
      hair = el("line", { class: "xhair", y1: m.t, y2: H - m.b, x1: -9, x2: -9 }, svg);
      dots = [];
      for (const s of data.series) {
        const d = s.values.map((v, i) => (i ? "L" : "M") + sx(data.x[i]).toFixed(1) + " " + sy(v).toFixed(1)).join("");
        el("path", { class: "ln " + s.cls, d }, svg);
        const last = s.values[n - 1];
        el("text", { class: "endlab", x: sx(x1) + 10, y: sy(last) + 4 }, svg).textContent = s.short;
        dots.push(el("circle", { class: "dot " + s.cls, r: 4.5, cx: sx(x1), cy: sy(last) }, svg));
      }
      if (box.classList.contains("active")) show(idx);
    };

    const show = i => {
      idx = Math.max(0, Math.min(n - 1, i));
      const x = sx(data.x[idx]);
      hair.setAttribute("x1", x); hair.setAttribute("x2", x);
      data.series.forEach((s, k) => { dots[k].setAttribute("cx", x); dots[k].setAttribute("cy", sy(s.values[idx])); });
      tip.textContent = "";
      const b = document.createElement("b");
      b.textContent = data.x[idx];
      tip.appendChild(b);
      for (const s of data.series) {
        const r = document.createElement("div");
        r.className = "row";
        const k = document.createElement("i");
        k.style.borderTopColor = s.cls === "s1" ? "var(--s1)" : "var(--ink-2)";
        if (s.cls !== "s1") k.style.borderTopStyle = "dashed";
        const v = document.createElement("strong");
        v.textContent = s.values[idx].toFixed(1) + "%";
        r.append(k, v, document.createTextNode(" " + s.name));
        tip.appendChild(r);
      }
      if (data.gapLabel) {
        const g = document.createElement("div");
        g.className = "row";
        const v = document.createElement("strong");
        v.textContent = fmt(data.series[0].values[idx] - data.series[1].values[idx]);
        g.append(document.createTextNode(data.gapLabel + " "), v, document.createTextNode(" points"));
        tip.appendChild(g);
      }
      const tw = tip.offsetWidth;
      let left = x + 12;
      if (left + tw > W) left = x - tw - 12;
      tip.style.transform = `translate(${Math.max(0, left)}px, ${Math.max(0, m.t)}px)`;
    };
    const end = () => { box.classList.remove("active"); draw(); };
    const near = ev => {
      const r = svg.getBoundingClientRect();
      const px = ev.clientX - r.left;
      let best = 0, bd = Infinity;
      data.x.forEach((v, i) => { const d = Math.abs(sx(v) - px); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    svg.addEventListener("pointermove", ev => { box.classList.add("active"); show(near(ev)); });
    svg.addEventListener("pointerdown", ev => { box.classList.add("active"); show(near(ev)); });
    svg.addEventListener("pointerleave", end);
    svg.addEventListener("focus", () => { box.classList.add("active"); show(idx); });
    svg.addEventListener("blur", end);
    svg.addEventListener("keydown", ev => {
      if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
        ev.preventDefault();
        box.classList.add("active");
        show(idx + (ev.key === "ArrowRight" ? 1 : -1));
      } else if (ev.key === "Escape") end();
    });
    const ro = new ResizeObserver(draw);
    ro.observe(box);
    draw();
  }

  document.querySelectorAll(".chart[data-src]").forEach(lineChart);
}
