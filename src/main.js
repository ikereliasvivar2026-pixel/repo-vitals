// Criminal Files — Case #0001
// Orquestación de pantallas y estado. 100% 2D, estilo "Mind Place" Alan Wake 2.

import { case1 } from "./cases/case1.js";
import { AudioEngine } from "./audio.js";
import { drawSuspectPortrait, drawEvidence, DustParticles } from "./art.js";

// ====================================================================
// Estado global
// ====================================================================
const state = {
  screen: "menu",
  difficulty: "detective",
  mode: "story",
  case: case1,
  evidenceFound: new Set(),
  suspectsMet: new Set(),
  questionsAsked: new Set(), // "suspectId:qId"
  revelations: new Set(),
  camerasViewed: new Set(),
  board: { suspect: null, motive: null, evidence: null },
  connectMode: false,
  connectFrom: null,
  strings: [], // [{from, to}]
  result: null,
};

const journalEntries = [];

const audio = new AudioEngine();

// Hooks de partículas por pantalla
let dustMenu = null;
let dustBriefing = null;
let dustWall = null;
let dustResult = null;
let crtTimer = null;

// ====================================================================
// Pequeños helpers
// ====================================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function showScreen(name) {
  state.screen = name;
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById(`screen-${name}`);
  if (el) el.classList.add("active");
}

function showOverlay(id) {
  document.getElementById(`modal-${id}`).classList.remove("hidden");
}

function hideOverlay(id) {
  document.getElementById(`modal-${id}`).classList.add("hidden");
}

function toast(title, body, ms = 2600) {
  const t = $("#toast");
  t.innerHTML = `<div class="toast-title">${title}</div>${body || ""}`;
  t.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add("hidden"), ms);
  audio.click();
}

// ====================================================================
// Boot
// ====================================================================
function boot() {
  setupMenu();
  setupBriefing();
  setupWall();
  setupEvidenceModal();
  setupInterviewModal();
  setupCamerasModal();
  setupJournalModal();
  setupPickerModal();
  setupResult();
  setupGlobalKeys();
  setupAudioToggle();

  // Partículas ambient en menú
  dustMenu = new DustParticles(document.getElementById("menu-particles"), {
    count: 50,
    color: "rgba(255,210,138,0.7)",
    lightX: 0.5,
  });
  dustMenu.start();

  // Loader fuera
  setTimeout(() => $("#loader").classList.add("hidden"), 400);

  audio.startAmbient("office");
}

// Los scripts de módulo se ejecutan tras parsearse el DOM, no hace falta
// esperar a DOMContentLoaded.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

// ====================================================================
// MENÚ
// ====================================================================
function setupMenu() {
  $$(".diff-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      audio.click();
      state.difficulty = btn.dataset.diff;
      $$(".diff-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    })
  );

  $$(".menu-card").forEach((card) =>
    card.addEventListener("click", () => {
      if (card.classList.contains("disabled")) return;
      audio.click();
      $$(".menu-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.mode = card.dataset.mode;
    })
  );

  $("#btn-start").addEventListener("click", () => {
    audio.resume();
    audio.click();
    openBriefing();
  });

  $("#btn-credits").addEventListener("click", () => {
    audio.click();
    toast(
      "Créditos",
      "Diseño y código: Iker + Devin. Sin assets externos: todo procedural."
    );
  });
}

// ====================================================================
// BRIEFING
// ====================================================================
function openBriefing() {
  showScreen("briefing");
  $("#briefing-title").textContent = case1.title;
  $("#briefing-body").innerHTML = case1.briefing
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  if (dustMenu) dustMenu.stop();
  if (!dustBriefing) {
    dustBriefing = new DustParticles(
      document.getElementById("briefing-particles"),
      {
        count: 40,
        color: "rgba(255,210,138,0.6)",
        lightX: 0.5,
      }
    );
  }
  dustBriefing.start();
  audio.startAmbient("office");
}

function setupBriefing() {
  $("#btn-briefing-back").addEventListener("click", () => {
    audio.click();
    showScreen("menu");
    dustBriefing && dustBriefing.stop();
    dustMenu && dustMenu.start();
  });
  $("#btn-briefing-go").addEventListener("click", () => {
    audio.click();
    enterWall();
  });
}

// ====================================================================
// MURO DEL CASO (Mind Place 2D)
// ====================================================================
const WALL_POSITIONS = {
  suspects: [
    { id: "marcos", x: 60, y: 180, rot: -3, tack: "red" },
    { id: "daniel", x: 220, y: 220, rot: 2, tack: "yellow" },
    { id: "sara", x: 60, y: 430, rot: 1, tack: "red" },
    { id: "victor", x: 220, y: 470, rot: -2, tack: "blue" },
  ],
  evidence: [
    { id: "body", x: 460, y: 180, rot: -2, tack: "red" },
    { id: "blood-stairs", x: 640, y: 200, rot: 3, tack: "red" },
    { id: "bracelet", x: 820, y: 180, rot: -3, tack: "red" },
    { id: "phone", x: 460, y: 470, rot: 4, tack: "yellow" },
    { id: "keys", x: 640, y: 480, rot: -2, tack: "yellow" },
    { id: "paint", x: 820, y: 470, rot: 3, tack: "red" },
  ],
};

function enterWall() {
  showScreen("wall");
  if (dustBriefing) dustBriefing.stop();
  if (!dustWall) {
    dustWall = new DustParticles(document.getElementById("wall-particles"), {
      count: 70,
      color: "rgba(255,210,138,0.7)",
      lightX: 0.5,
    });
  }
  dustWall.start();
  audio.startAmbient("office");
  populateWall();
  updateAccuseUI();
  startCrtClock();
}

function setupWall() {
  // Toolbar
  $$('#screen-wall .tool-btn').forEach((b) =>
    b.addEventListener("click", () => onToolbar(b.dataset.tool))
  );

  // Slots de acusación
  $$(".accuse-slot").forEach((slot) =>
    slot.addEventListener("click", () => {
      audio.click();
      openPicker(slot.dataset.slot);
    })
  );

  $("#btn-accuse").addEventListener("click", () => {
    audio.click();
    formalizeAccusation();
  });

  // Cámaras CRT
  $("#crt-monitor").addEventListener("click", () => {
    audio.click();
    openCameras();
  });

  // Cancel conectar
  $("#btn-cancel-connect").addEventListener("click", () => {
    setConnectMode(false);
  });
}

function onToolbar(tool) {
  audio.click();
  if (tool === "journal") openJournal();
  else if (tool === "connect") setConnectMode(!state.connectMode);
  else if (tool === "clear-strings") {
    state.strings = state.strings.filter((s) => s.permanent);
    drawStrings();
    toast("Hilos cortados");
  } else if (tool === "quit") leaveWall();
}

function leaveWall() {
  if (confirm("¿Salir al menú? Perderás el progreso actual.")) {
    window.location.reload();
  }
}

function setConnectMode(on) {
  state.connectMode = on;
  state.connectFrom = null;
  $$(".polaroid.connecting-source").forEach((p) =>
    p.classList.remove("connecting-source")
  );
  document.getElementById("strings").classList.toggle("connect-mode", on);
  $("#connect-banner").classList.toggle("hidden", !on);
  const btn = $$("#screen-wall .tool-btn").find(
    (b) => b.dataset.tool === "connect"
  );
  if (btn) {
    btn.classList.toggle("active", on);
    btn.querySelector(".tool-state").textContent = on ? "on" : "off";
  }
}

function populateWall() {
  const suspectsArea = $("#suspects-area");
  suspectsArea.innerHTML = "";
  WALL_POSITIONS.suspects.forEach((pos) => {
    const susp = case1.suspects.find((s) => s.id === pos.id);
    if (!susp) return;
    const el = makePolaroid({
      kind: "suspect",
      data: susp,
      pos,
      classes: "suspect-card",
    });
    suspectsArea.appendChild(el);
  });

  const evArea = $("#evidence-area");
  evArea.innerHTML = "";
  WALL_POSITIONS.evidence.forEach((pos, idx) => {
    const ev = case1.evidence.find((e) => e.id === pos.id);
    if (!ev) return;
    const el = makePolaroid({
      kind: "evidence",
      data: ev,
      pos,
      classes: "evidence-card",
      number: idx + 1,
    });
    evArea.appendChild(el);
  });

  drawStrings();
}

function makePolaroid({ kind, data, pos, classes, number }) {
  const el = document.createElement("div");
  el.className = `polaroid ${classes}`;
  el.style.left = pos.x + "px";
  el.style.top = pos.y + "px";
  el.style.setProperty("--rot", pos.rot + "deg");
  el.style.transform = `rotate(${pos.rot}deg)`;
  el.style.animationDelay = (Math.random() * -7) + "s";
  el.dataset.kind = kind;
  el.dataset.id = data.id;

  const tack = document.createElement("div");
  tack.className = "tack " + (pos.tack || "");
  el.appendChild(tack);

  const photoBox = document.createElement("div");
  photoBox.className = "photo";

  // Canvas dentro de la foto
  const c = document.createElement("canvas");
  c.width = kind === "suspect" ? 200 : 240;
  c.height = kind === "suspect" ? 150 : 180;
  c.style.width = "100%";
  c.style.height = "100%";
  c.style.display = "block";
  photoBox.appendChild(c);
  el.appendChild(photoBox);

  const ctx = c.getContext("2d");
  if (kind === "suspect") {
    drawSuspectPortrait(ctx, c.width, c.height, {
      ...data,
      _interviewed: state.suspectsMet.has(data.id),
      hairColor:
        data.id === "sara"
          ? "#3a1a08"
          : data.id === "marcos"
            ? "#2b1a0e"
            : data.id === "daniel"
              ? "#4a2a18"
              : "#9a8a78",
    });
  } else {
    drawEvidence(ctx, c.width, c.height, data);
  }

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.textContent =
    kind === "suspect" ? data.name.split(" ")[0] : data.shortName || data.name.slice(0, 22);
  el.appendChild(caption);

  if (kind === "evidence" && number) {
    const stamp = document.createElement("div");
    stamp.className = "stamp";
    stamp.textContent = "#" + number;
    el.appendChild(stamp);
  }
  if (kind === "evidence" && state.evidenceFound.has(data.id)) {
    el.classList.add("collected");
  }

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.connectMode) {
      onConnectClick(el);
    } else {
      audio.click();
      if (kind === "suspect") openInterview(data);
      else openEvidence(data, number);
    }
  });
  el.addEventListener("mouseenter", () => audio.hover());

  return el;
}

function onConnectClick(el) {
  audio.click();
  if (!state.connectFrom) {
    state.connectFrom = el;
    el.classList.add("connecting-source");
    return;
  }
  if (state.connectFrom === el) {
    state.connectFrom = null;
    el.classList.remove("connecting-source");
    return;
  }
  // Conectar from → el
  const fromKey = state.connectFrom.dataset.kind + ":" + state.connectFrom.dataset.id;
  const toKey = el.dataset.kind + ":" + el.dataset.id;
  if (!state.strings.find((s) => s.from === fromKey && s.to === toKey)) {
    state.strings.push({ from: fromKey, to: toKey, color: "user" });
    audio.thump();
    toast("Hilo tendido", "Conexión añadida al tablero");
  }
  state.connectFrom.classList.remove("connecting-source");
  state.connectFrom = null;
  drawStrings();
}

function drawStrings() {
  const svg = document.getElementById("strings-group");
  if (!svg) return;
  svg.innerHTML = "";

  const corkboard = $("#corkboard");
  const cbRect = corkboard.getBoundingClientRect();
  // Las cuerdas se dibujan en viewBox de 1600x900
  const scaleX = 1600 / cbRect.width;
  const scaleY = 900 / cbRect.height;

  const getCenter = (key) => {
    const [kind, id] = key.split(":");
    const sel = `.polaroid[data-kind="${kind}"][data-id="${id}"]`;
    const el = corkboard.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2 - cbRect.left;
    const cy = r.top + r.height / 2 - cbRect.top;
    return { x: cx * scaleX, y: cy * scaleY };
  };

  state.strings.forEach((s) => {
    const a = getCenter(s.from);
    const b = getCenter(s.to);
    if (!a || !b) return;
    drawStringSvg(svg, a, b, s.color);
  });
}

function drawStringSvg(group, a, b, color) {
  const ns = "http://www.w3.org/2000/svg";
  // Sombra ligera (curva)
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const sag = Math.min(60, dist * 0.12);
  // Punto de control para curva con caída
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + sag;
  const p = document.createElementNS(ns, "path");
  p.setAttribute("d", `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`);
  p.setAttribute("fill", "none");
  p.setAttribute(
    "stroke",
    color === "evidence" ? "#d4a72c" : color === "key" ? "#2e7a3a" : "#b51b2c"
  );
  p.setAttribute("stroke-width", "3");
  p.setAttribute("stroke-linecap", "round");
  p.setAttribute("opacity", "0.92");
  group.appendChild(p);

  // Pequeño nudo en los extremos
  [a, b].forEach(({ x, y }) => {
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", "5");
    c.setAttribute("fill", "#1a0a0a");
    c.setAttribute("opacity", "0.7");
    group.appendChild(c);
  });
}

window.addEventListener("resize", () => {
  if (state.screen === "wall") drawStrings();
});

function startCrtClock() {
  if (crtTimer) clearInterval(crtTimer);
  const seq = ["00:48", "01:08", "01:23", "01:42", "03:38", "03:40", "06:00", "06:47"];
  let i = 0;
  crtTimer = setInterval(() => {
    const el = $("#crt-time");
    if (!el) return;
    el.textContent = seq[i % seq.length];
    i++;
  }, 1400);
}

// ====================================================================
// MODAL EVIDENCIA
// ====================================================================
let currentEvidence = null;
function setupEvidenceModal() {
  $$('#modal-evidence [data-close="evidence"]').forEach((b) =>
    b.addEventListener("click", () => {
      audio.click();
      hideOverlay("evidence");
    })
  );
  $("#btn-evidence-pick").addEventListener("click", () => {
    if (!currentEvidence) return;
    audio.evidenceFound();
    if (!state.evidenceFound.has(currentEvidence.id)) {
      state.evidenceFound.add(currentEvidence.id);
      (currentEvidence.reveals || []).forEach((r) =>
        state.revelations.add(r)
      );
      addJournalNote(
        "evidence",
        currentEvidence.id,
        currentEvidence.name,
        currentEvidence.look
      );
      // Marcar como collected
      const polaroid = document.querySelector(
        `.polaroid[data-kind="evidence"][data-id="${currentEvidence.id}"]`
      );
      if (polaroid) polaroid.classList.add("collected");
      // Tirar hilo automático evidencia → víctima (centro)
      // (efecto secundario: añade hilo dorado entre la evidencia y la cabecera; lo omitimos por simplicidad)
      toast("Pista añadida al expediente", currentEvidence.name);
    }
    hideOverlay("evidence");
  });
}

function openEvidence(ev, number) {
  currentEvidence = ev;
  showOverlay("evidence");
  $("#examine-title").textContent = ev.name;
  $("#examine-meta").textContent = `Tipo: ${ev.type} · Hallada en escena · Pieza #${number || "?"}`;
  $("#examine-body").innerHTML = escapeHtml(ev.look);
  $("#examine-num").textContent = "#" + (number || "?");
  // Canvas grande
  const c = document.getElementById("examine-canvas");
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  drawEvidence(ctx, c.width, c.height, ev);

  // Cambiar botón si ya está recogida
  const btn = $("#btn-evidence-pick");
  if (state.evidenceFound.has(ev.id)) {
    btn.textContent = "Ya en el expediente ✓";
    btn.disabled = true;
  } else {
    btn.textContent = "Añadir al expediente";
    btn.disabled = false;
  }
}

// ====================================================================
// MODAL INTERROGATORIO
// ====================================================================
let currentSuspect = null;
function setupInterviewModal() {
  $$('#modal-interview [data-close="interview"]').forEach((b) =>
    b.addEventListener("click", () => {
      audio.click();
      hideOverlay("interview");
    })
  );
}

function openInterview(susp) {
  currentSuspect = susp;
  showOverlay("interview");

  $("#interview-name").textContent = susp.name;
  $("#interview-role").textContent = susp.role;
  $("#interview-quote").textContent = `"${susp.opening}"`;

  // Polaroid del sospechoso (grande)
  const c = document.getElementById("interview-canvas");
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  drawSuspectPortrait(ctx, c.width, c.height, {
    ...susp,
    _interviewed: state.suspectsMet.has(susp.id),
    hairColor:
      susp.id === "sara"
        ? "#3a1a08"
        : susp.id === "marcos"
          ? "#2b1a0e"
          : susp.id === "daniel"
            ? "#4a2a18"
            : "#9a8a78",
  });

  // Marcar como conocido
  if (!state.suspectsMet.has(susp.id)) {
    state.suspectsMet.add(susp.id);
    addJournalNote(
      "suspect",
      susp.id,
      susp.name,
      `${susp.role}. ${susp.brief}`
    );
    // Refrescar polaroid del muro (para el sello "interrogado")
    refreshSuspectPolaroid(susp.id);
  }

  renderInterviewOptions();
}

function refreshSuspectPolaroid(id) {
  const el = document.querySelector(
    `.polaroid[data-kind="suspect"][data-id="${id}"]`
  );
  if (!el) return;
  const c = el.querySelector("canvas");
  const susp = case1.suspects.find((s) => s.id === id);
  drawSuspectPortrait(c.getContext("2d"), c.width, c.height, {
    ...susp,
    _interviewed: true,
    hairColor:
      id === "sara"
        ? "#3a1a08"
        : id === "marcos"
          ? "#2b1a0e"
          : id === "daniel"
            ? "#4a2a18"
            : "#9a8a78",
  });
}

function renderInterviewOptions() {
  const susp = currentSuspect;
  const container = $("#interview-options");
  container.innerHTML = "";
  susp.questions.forEach((q) => {
    const opt = document.createElement("button");
    opt.className = "interview-option";
    const asked = state.questionsAsked.has(`${susp.id}:${q.id}`);
    if (asked) opt.classList.add("asked");

    // Requisitos
    const locked =
      q.requires &&
      q.requires.some((r) => !state.questionsAsked.has(`${susp.id}:${r}`));

    opt.textContent = q.q + (locked ? "  (bloqueada)" : "");
    if (locked) opt.disabled = true;
    opt.addEventListener("click", () => {
      audio.click();
      askQuestion(susp, q);
    });
    container.appendChild(opt);
  });

  const close = document.createElement("button");
  close.className = "interview-option";
  close.style.borderColor = "#5a1a1a";
  close.style.color = "#ffb5b5";
  close.textContent = "Finalizar entrevista";
  close.addEventListener("click", () => {
    audio.click();
    hideOverlay("interview");
  });
  container.appendChild(close);
}

function askQuestion(susp, q) {
  state.questionsAsked.add(`${susp.id}:${q.id}`);
  (q.reveals || []).forEach((r) => state.revelations.add(r));
  $("#interview-quote").textContent = `"${q.a}"`;
  addJournalNote("question", `${susp.id}:${q.id}`, `${susp.name} — ${q.q}`, q.a);
  renderInterviewOptions();
}

// ====================================================================
// MODAL CÁMARAS
// ====================================================================
function setupCamerasModal() {
  $$('#modal-cameras [data-close="cameras"]').forEach((b) =>
    b.addEventListener("click", () => {
      audio.click();
      hideOverlay("cameras");
    })
  );
}

function openCameras() {
  showOverlay("cameras");
  const grid = $("#cameras-grid");
  grid.innerHTML = "";
  case1.cameras.forEach((cam) => {
    const card = document.createElement("div");
    card.className = "cam-card";
    card.dataset.id = cam.id;

    const feed = document.createElement("div");
    feed.className = "cam-feed" + (cam.broken ? " broken" : "");
    card.appendChild(feed);

    const label = document.createElement("div");
    label.className = "cam-label";
    label.textContent = cam.label.split(" — ")[0];
    card.appendChild(label);

    const rec = document.createElement("div");
    rec.className = "cam-rec";
    rec.textContent = cam.broken ? "ERR" : "REC";
    card.appendChild(rec);

    const time = document.createElement("div");
    time.className = "cam-time";
    time.textContent = cam.timestamp.split(" — ")[0];
    card.appendChild(time);

    const scene = document.createElement("div");
    scene.className = "cam-scene";
    scene.innerHTML = cam.broken
      ? "<span>SIN SEÑAL</span>"
      : `<span>${cam.label.split(" — ")[1] || "—"}</span>`;
    card.appendChild(scene);

    card.addEventListener("click", () => {
      audio.click();
      $$("#cameras-grid .cam-card").forEach((c) =>
        c.classList.remove("active")
      );
      card.classList.add("active");
      showCameraDetail(cam);
    });

    grid.appendChild(card);
  });

  $("#cameras-detail").innerHTML =
    "<em>Selecciona una cámara para reproducir la grabación.</em>";
}

function showCameraDetail(cam) {
  if (!state.camerasViewed.has(cam.id)) {
    state.camerasViewed.add(cam.id);
    (cam.reveals || []).forEach((r) => state.revelations.add(r));
    addJournalNote(
      "camera",
      cam.id,
      cam.label,
      cam.footage || "Grabación borrada o cámara fuera de servicio."
    );
  }

  const html = `
    <h3>${escapeHtml(cam.label)}</h3>
    <div class="timestamp">Ventana ${escapeHtml(cam.timestamp)}</div>
    <p>${cam.footage ? escapeHtml(cam.footage) : "<em>Grabación borrada o cámara fuera de servicio.</em>"}</p>
    ${cam.hint ? `<p class="important">📌 ${escapeHtml(cam.hint)}</p>` : ""}
  `;
  $("#cameras-detail").innerHTML = html;
}

// ====================================================================
// MODAL DIARIO
// ====================================================================
function setupJournalModal() {
  $$('#modal-journal [data-close="journal"]').forEach((b) =>
    b.addEventListener("click", () => {
      audio.click();
      hideOverlay("journal");
    })
  );
  $$(".journal-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      audio.click();
      $$(".journal-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderJournal(tab.dataset.tab);
    })
  );
}

function openJournal() {
  showOverlay("journal");
  $$(".journal-tab").forEach((t) => t.classList.remove("active"));
  const tab = document.querySelector('.journal-tab[data-tab="evidence"]');
  tab.classList.add("active");
  renderJournal("evidence");
}

function renderJournal(tab) {
  const c = $("#journal-content");
  c.innerHTML = "";

  if (tab === "evidence") {
    const items = case1.evidence.filter((e) => state.evidenceFound.has(e.id));
    if (!items.length) {
      c.innerHTML =
        '<div class="journal-empty">Aún no has recogido ninguna pista. Haz clic en una polaroid del muro.</div>';
      return;
    }
    items.forEach((e) => {
      const el = document.createElement("div");
      el.className = "journal-entry";
      el.innerHTML = `
        <div class="journal-entry-title">${escapeHtml(e.name)}</div>
        <div class="journal-entry-body">${escapeHtml(e.look)}</div>
        <div class="journal-entry-meta">Tipo: ${e.type}</div>
      `;
      c.appendChild(el);
    });
  } else if (tab === "suspects") {
    const items = case1.suspects.filter((s) => state.suspectsMet.has(s.id));
    if (!items.length) {
      c.innerHTML =
        '<div class="journal-empty">Aún no has hablado con ningún sospechoso.</div>';
      return;
    }
    items.forEach((s) => {
      const el = document.createElement("div");
      el.className = "journal-entry";
      const asks = s.questions
        .filter((q) => state.questionsAsked.has(`${s.id}:${q.id}`))
        .map(
          (q) => `<li><b>${escapeHtml(q.q)}</b><br/><em>${escapeHtml(q.a)}</em></li>`
        )
        .join("");
      el.innerHTML = `
        <div class="journal-entry-title">${escapeHtml(s.name)} — ${escapeHtml(s.role)}</div>
        <div class="journal-entry-body">${escapeHtml(s.brief)}</div>
        ${asks ? `<ul style="margin-top:8px;">${asks}</ul>` : ""}
      `;
      c.appendChild(el);
    });
  } else if (tab === "timeline") {
    const events = buildTimeline();
    if (!events.length) {
      c.innerHTML =
        '<div class="journal-empty">Aún no hay eventos reconstruidos. Recoge pistas y revisa las cámaras.</div>';
      return;
    }
    events.forEach((ev) => {
      const el = document.createElement("div");
      el.className = "journal-entry";
      el.innerHTML = `
        <div class="journal-entry-title">${escapeHtml(ev.time)}</div>
        <div class="journal-entry-body">${escapeHtml(ev.text)}</div>
      `;
      c.appendChild(el);
    });
  } else {
    if (!journalEntries.length) {
      c.innerHTML =
        '<div class="journal-empty">El diario está en blanco. Tus interacciones aparecerán aquí.</div>';
      return;
    }
    journalEntries
      .slice()
      .reverse()
      .forEach((n) => {
        const el = document.createElement("div");
        el.className = "journal-entry";
        el.innerHTML = `
          <div class="journal-entry-title">${escapeHtml(n.title)}</div>
          <div class="journal-entry-body">${escapeHtml(n.body || "")}</div>
          <div class="journal-entry-meta">[${n.kind}] ${n.ts}</div>
        `;
        c.appendChild(el);
      });
  }
}

function buildTimeline() {
  const ev = [];
  if (state.revelations.has("cam1-noentry")) {
    ev.push({
      time: "23:02",
      text: "Cierre normal del parque. Marcos sale a las 23:11 (CAM 01).",
    });
  }
  if (state.revelations.has("victor-shift")) {
    ev.push({
      time: "23:30",
      text: "Víctor declara haber entrado a su turno nocturno.",
    });
  }
  if (state.revelations.has("victor-tool")) {
    ev.push({
      time: "00:48",
      text:
        "Víctor entra al almacén de mantenimiento (CAM 04). Sale a las 01:23 con un objeto largo.",
    });
  }
  if (state.revelations.has("lucia-message")) {
    ev.push({
      time: "00:51",
      text:
        "Lucía envía a Sara un mensaje: 'Tengo pruebas, esta noche se acaba'. Lo borra al instante.",
    });
  }
  if (state.revelations.has("lucia-call")) {
    ev.push({
      time: "01:08",
      text: "Llamada perdida en el móvil de Lucía desde número desconocido.",
    });
  }
  if (state.revelations.has("cam3-deleted")) {
    ev.push({
      time: "01:30 — 02:15",
      text: "Cámara 03 de vestuarios desactivada manualmente desde el panel interno.",
    });
  }
  if (state.revelations.has("cam2-shadow")) {
    ev.push({
      time: "01:42",
      text:
        "Silueta visible 3s en lo alto del tobogán principal (CAM 02). Hora coincidente con el golpe.",
    });
  }
  if (state.revelations.has("pool-attack-location")) {
    ev.push({
      time: "~ 01:45",
      text:
        "Lugar del ataque reconstruido: lo alto de la escalera del tobogán. Sangre y cabello.",
    });
  }
  if (state.revelations.has("victor-wet")) {
    ev.push({
      time: "03:38",
      text:
        "Víctor vuelve a la sala de máquinas empapado, se cambia (CAM 06). Mete algo en una bolsa.",
    });
  }
  if (state.revelations.has("evidence-bag")) {
    ev.push({
      time: "03:40",
      text:
        "Bolsa negra con efectos personales del sospechoso. Pendiente de inspección.",
    });
  }
  ev.push({
    time: "06:47",
    text: "Aviso al 112 desde la oficina del parque.",
  });
  return ev.sort((a, b) => a.time.localeCompare(b.time));
}

function addJournalNote(kind, id, title, body) {
  journalEntries.push({
    kind,
    id,
    title,
    body,
    ts: new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
}

// ====================================================================
// MODAL PICKER (acuse zone)
// ====================================================================
let currentSlot = null;
function setupPickerModal() {
  $$('#modal-picker [data-close="picker"]').forEach((b) =>
    b.addEventListener("click", () => {
      audio.click();
      hideOverlay("picker");
    })
  );
}

function openPicker(slot) {
  currentSlot = slot;
  showOverlay("picker");
  const list = $("#picker-list");
  list.innerHTML = "";
  let items = [];
  let title = "Selecciona";
  if (slot === "suspect") {
    title = "¿Quién es el responsable?";
    items = case1.suspects
      .filter((s) => state.suspectsMet.has(s.id))
      .map((s) => ({ id: s.id, label: s.name, sub: s.role }));
    if (!items.length)
      items = case1.suspects.map((s) => ({
        id: s.id,
        label: s.name,
        sub: s.role,
      }));
  } else if (slot === "motive") {
    title = "¿Cuál fue el móvil?";
    items = case1.motives.map((m) => ({
      id: m.id,
      label: m.label,
      sub: m.desc,
    }));
  } else if (slot === "evidence") {
    title = "¿Cuál es la prueba clave?";
    items = case1.evidence
      .filter((e) => state.evidenceFound.has(e.id))
      .map((e) => ({ id: e.id, label: e.name, sub: e.type }));
    if (!items.length)
      items = [
        {
          id: null,
          label: "(Sin pistas recogidas todavía)",
          sub: "Vuelve al muro y recoge alguna.",
          disabled: true,
        },
      ];
  }
  $("#picker-title").textContent = title;
  items.forEach((it) => {
    const b = document.createElement("button");
    b.className = "picker-item";
    if (state.board[slot] === it.id) b.classList.add("selected");
    if (it.disabled) b.disabled = true;
    b.innerHTML = `<b>${escapeHtml(it.label)}</b>${it.sub ? `<small>${escapeHtml(it.sub)}</small>` : ""}`;
    b.addEventListener("click", () => {
      if (it.disabled) return;
      audio.click();
      state.board[slot] = it.id;
      updateAccuseUI();
      hideOverlay("picker");
    });
    list.appendChild(b);
  });
}

function updateAccuseUI() {
  $$(".accuse-slot").forEach((slot) => {
    const key = slot.dataset.slot;
    const v = state.board[key];
    slot.classList.toggle("filled", !!v);
    let label = "—";
    if (v) {
      if (key === "suspect") {
        label = case1.suspects.find((s) => s.id === v)?.name || "—";
      } else if (key === "motive") {
        label = case1.motives.find((m) => m.id === v)?.label || "—";
      } else if (key === "evidence") {
        label = case1.evidence.find((e) => e.id === v)?.name || "—";
      }
    }
    slot.querySelector(".slot-value").textContent = label;
  });

  const needed = case1.pointsByDifficulty[state.difficulty];
  const enough = needed.every((k) => state.board[k] != null);
  $("#btn-accuse").disabled = !enough;
}

function formalizeAccusation() {
  const needed = case1.pointsByDifficulty[state.difficulty];
  const enough = needed.every((k) => state.board[k] != null);
  if (!enough) {
    toast(
      "Faltan datos",
      `Para ${state.difficulty.toUpperCase()} necesitas: ${needed.join(", ")}`
    );
    return;
  }
  const sol = case1.solution;
  const correct = {
    suspect: state.board.suspect === sol.suspect,
    motive: state.board.motive === sol.motive,
    evidence: state.board.evidence === sol.evidence,
  };
  const hits = needed.filter((k) => correct[k]).length;
  let outcome;
  if (hits === needed.length) {
    outcome = hits === 3 ? "success" : "partial";
  } else if (correct.suspect && needed.includes("suspect")) {
    outcome = "partial";
  } else {
    outcome = "failure";
  }
  state.result = { outcome, correct, needed };
  showResult();
}

// ====================================================================
// RESULTADO
// ====================================================================
function setupResult() {
  $("#btn-result-menu").addEventListener("click", () => {
    audio.click();
    window.location.reload();
  });
  $("#btn-result-retry").addEventListener("click", () => {
    audio.click();
    window.location.reload();
  });
}

function showResult() {
  showScreen("result");
  if (dustWall) dustWall.stop();
  if (!dustResult) {
    dustResult = new DustParticles(
      document.getElementById("result-particles"),
      { count: 50, color: "rgba(255,210,138,0.6)", lightX: 0.5 }
    );
  }
  dustResult.start();

  const { outcome, correct } = state.result;
  const card = $("#result-card");
  const stamp = $("#result-stamp");
  const title = $("#result-title");
  const body = $("#result-body");

  card.classList.toggle("failure", outcome === "failure");

  if (outcome === "success") {
    stamp.textContent = "RESUELTO";
    stamp.style.borderColor = "var(--good)";
    stamp.style.color = "var(--good)";
    title.textContent = "Caso resuelto. Justicia para Lucía.";
    audio.win();
  } else if (outcome === "partial") {
    stamp.textContent = "ACUSACIÓN PARCIAL";
    stamp.style.borderColor = "var(--accent)";
    stamp.style.color = "var(--accent)";
    title.textContent = "El culpable cae, pero el fiscal necesita más.";
    audio.win();
  } else {
    stamp.textContent = "ACUSACIÓN FALLIDA";
    stamp.style.borderColor = "var(--string)";
    stamp.style.color = "var(--string)";
    title.textContent = "El verdadero culpable sigue libre.";
    audio.lose();
  }

  let txt = "";
  if (outcome === "success") {
    txt += `<p>${escapeHtml(case1.resolution.success)}</p>`;
  } else if (outcome === "partial") {
    txt += `<p>${escapeHtml(case1.resolution.partial)}</p>`;
    txt += `<h3>Lo que demostraste</h3>`;
    txt += `<p>${correct.suspect ? "✔" : "✖"} Identificaste al sospechoso correcto.<br/>`;
    txt += `${correct.motive ? "✔" : "✖"} ${correct.motive ? "Acertaste el móvil." : "Errar el móvil deja la motivación abierta a duda."}<br/>`;
    txt += `${correct.evidence ? "✔" : "✖"} ${correct.evidence ? "Identificaste la prueba clave." : "Tu prueba principal no fue la más concluyente."}</p>`;
  } else {
    txt += `<p>${escapeHtml(case1.resolution.failure)}</p>`;
  }
  body.innerHTML = txt;
}

// ====================================================================
// Global
// ====================================================================
function setupGlobalKeys() {
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      // Cierra cualquier modal abierto
      const open = $$(".modal-overlay:not(.hidden)");
      if (open.length) {
        open.forEach((o) => o.classList.add("hidden"));
        audio.click();
        return;
      }
      if (state.connectMode) {
        setConnectMode(false);
        return;
      }
    }
    if (e.code === "Tab" && state.screen === "wall") {
      e.preventDefault();
      openJournal();
    }
    if (e.code === "KeyM") {
      toggleAudio();
    }
  });
}

function setupAudioToggle() {
  $("#audio-toggle").addEventListener("click", () => toggleAudio());
}
function toggleAudio() {
  const on = audio.toggleMute();
  $("#audio-toggle").textContent = on ? "🔊" : "🔇";
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
