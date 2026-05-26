// Ilustraciones generadas en canvas — estilo noir / expediente.
// Cada función recibe (ctx, w, h) y dibuja una "foto" estilizada.

// ====================================================================
// Helpers
// ====================================================================
function paperGrain(ctx, w, h, alpha = 0.06) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * alpha;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
}

function vignette(ctx, w, h, strength = 0.55) {
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.25,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.75
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function topLight(ctx, w, h, color = "rgba(255,235,200,0.18)") {
  const g = ctx.createRadialGradient(w / 2, -h * 0.2, h * 0.1, w / 2, h * 0.4, h);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function bloodSplat(ctx, x, y, r, alpha = 1) {
  ctx.fillStyle = `rgba(120,15,20,${alpha})`;
  // Mancha central irregular
  ctx.beginPath();
  for (let i = 0; i <= 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const rr = r * (0.6 + Math.sin(i * 1.7) * 0.18 + Math.random() * 0.45);
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  // Núcleo oscuro
  ctx.fillStyle = `rgba(70,5,10,${alpha * 0.8})`;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
  ctx.fill();
  // Gotas satélite
  ctx.fillStyle = `rgba(120,15,20,${alpha})`;
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = r * (1.3 + Math.random() * 2.4);
    const sr = r * (0.05 + Math.random() * 0.22);
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  // Gotas alargadas (impacto direccional)
  for (let i = 0; i < 5; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = r * (1.6 + Math.random() * 1.5);
    ctx.save();
    ctx.translate(x + Math.cos(a) * d, y + Math.sin(a) * d);
    ctx.rotate(a);
    ctx.fillStyle = `rgba(120,15,20,${alpha * 0.9})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.18, r * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function evidenceTag(ctx, x, y, text, rotation = -0.05) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(-22, -10, 48, 28);
  // Tarjeta
  ctx.fillStyle = "#f4ecd8";
  ctx.fillRect(-24, -12, 48, 28);
  ctx.strokeStyle = "#1c1810";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-24, -12, 48, 28);
  // Línea punteada arriba
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.setLineDash([2, 2]);
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-22, -7);
  ctx.lineTo(22, -7);
  ctx.stroke();
  ctx.setLineDash([]);
  // Etiqueta "ID"
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.font = "5px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EVIDENCIA", 0, -9);
  // Número
  ctx.fillStyle = "#b51b2c";
  ctx.font = "bold 18px Georgia";
  ctx.fillText(text, 0, 5);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
}

function adjustColor(color, amount) {
  if (typeof color === "string") return color;
  const r = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (color & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

// ====================================================================
// SOSPECHOSOS — retratos estilo mugshot
// ====================================================================

const SUSPECT_LOOKS = {
  marcos: {
    skin: "#c79e7e",
    skinShadow: "#8a614a",
    hair: "#241410",
    hairHighlight: "#3b2418",
    beard: "#2a1810",
    shirt: "#7a3c2a",
    shirtShadow: "#4a1f12",
    style: "polo-stained", // socorrista
    age: "29",
    eyeColor: "#3a2412",
    expression: "tired",
  },
  daniel: {
    skin: "#d9b698",
    skinShadow: "#9d795b",
    hair: "#3a2418",
    hairHighlight: "#5a3818",
    beard: null,
    shirt: "#1f3a5c",
    shirtShadow: "#0d1c30",
    style: "hoodie", // ex-novio joven
    age: "20",
    eyeColor: "#2a3a4a",
    expression: "angry",
  },
  sara: {
    skin: "#dcb094",
    skinShadow: "#9a7656",
    hair: "#2a1408",
    hairHighlight: "#4a200a",
    beard: null,
    shirt: "#a83a5a",
    shirtShadow: "#6a1830",
    style: "tank", // amiga, top rosa
    age: "19",
    eyeColor: "#1a3a2a",
    expression: "sad",
  },
  victor: {
    skin: "#b8957a",
    skinShadow: "#7a5d44",
    hair: null, // calvo
    hairHighlight: null,
    beard: "#a89880",
    shirt: "#6a8050",
    shirtShadow: "#3a4828",
    style: "uniform", // mantenimiento
    age: "47",
    eyeColor: "#3a2a18",
    expression: "guilty",
  },
};

export function drawSuspectPortrait(ctx, w, h, susp) {
  const look = SUSPECT_LOOKS[susp.id] || SUSPECT_LOOKS.marcos;

  // Fondo de pared azul oscuro estilo mugshot
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#5a6a78");
  bg.addColorStop(0.5, "#3a4858");
  bg.addColorStop(1, "#1a242e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Líneas de altura (foto policial) — números laterales
  ctx.strokeStyle = "rgba(244,236,216,0.16)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    const y = (i / 10) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // Marcadores numéricos
  ctx.fillStyle = "rgba(244,236,216,0.4)";
  ctx.font = "bold 8px Courier New";
  ctx.textAlign = "left";
  const heights = ["6'0", "5'10", "5'8", "5'6", "5'4", "5'2", "5'0"];
  for (let i = 0; i < heights.length; i++) {
    ctx.fillText(heights[i], 4, h * 0.15 + (h * 0.7 * i) / heights.length);
  }

  // Sombra del personaje en la pared
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.beginPath();
  ctx.ellipse(w / 2 + 6, h * 0.42, w * 0.24, h * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const cx = w / 2;
  const baseY = h;

  // ---- ROPA / HOMBROS ----
  drawClothing(ctx, w, h, cx, look);

  // ---- CUELLO ----
  const neckGrad = ctx.createLinearGradient(0, h * 0.55, 0, h * 0.72);
  neckGrad.addColorStop(0, look.skin);
  neckGrad.addColorStop(1, look.skinShadow);
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.07, h * 0.55);
  ctx.lineTo(cx - w * 0.1, h * 0.72);
  ctx.lineTo(cx + w * 0.1, h * 0.72);
  ctx.lineTo(cx + w * 0.07, h * 0.55);
  ctx.closePath();
  ctx.fill();

  // Sombra clavícula
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.7, w * 0.12, h * 0.025, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- CABEZA ----
  // Base (luz cenital → más claro arriba)
  const headGrad = ctx.createRadialGradient(
    cx - w * 0.04,
    h * 0.32,
    w * 0.05,
    cx,
    h * 0.42,
    w * 0.25
  );
  headGrad.addColorStop(0, brighten(look.skin, 15));
  headGrad.addColorStop(0.5, look.skin);
  headGrad.addColorStop(1, look.skinShadow);
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.4, w * 0.19, h * 0.23, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sombra lateral derecha
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(cx + w * 0.1, h * 0.42, w * 0.07, h * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mandíbula
  ctx.fillStyle = look.skinShadow;
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.52, w * 0.14, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- OREJAS ----
  ctx.fillStyle = look.skinShadow;
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.185, h * 0.42, w * 0.025, h * 0.04, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + w * 0.185, h * 0.42, w * 0.025, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- PELO ----
  drawHair(ctx, w, h, cx, look, susp.id);

  // ---- CEJAS ----
  ctx.strokeStyle = look.hair || look.beard || "#2a1810";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  // Izquierda
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.11, h * 0.36);
  ctx.lineTo(cx - w * 0.04, h * 0.355);
  ctx.stroke();
  // Derecha — más caída para "tristeza" o más alta para "enfado"
  ctx.beginPath();
  if (look.expression === "angry") {
    ctx.moveTo(cx + w * 0.04, h * 0.358);
    ctx.lineTo(cx + w * 0.11, h * 0.348);
  } else if (look.expression === "sad") {
    ctx.moveTo(cx + w * 0.04, h * 0.353);
    ctx.lineTo(cx + w * 0.11, h * 0.367);
  } else {
    ctx.moveTo(cx + w * 0.04, h * 0.355);
    ctx.lineTo(cx + w * 0.11, h * 0.36);
  }
  ctx.stroke();

  // ---- OJOS ----
  drawEyes(ctx, w, h, cx, look);

  // ---- NARIZ ----
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.015, h * 0.42);
  ctx.lineTo(cx - w * 0.02, h * 0.46);
  ctx.lineTo(cx + w * 0.015, h * 0.47);
  ctx.stroke();
  // Fosa nasal sutil
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.arc(cx - w * 0.012, h * 0.475, 1.2, 0, Math.PI * 2);
  ctx.arc(cx + w * 0.018, h * 0.475, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // ---- BOCA ----
  drawMouth(ctx, w, h, cx, look);

  // ---- BARBA / SOMBRA DE BARBA ----
  if (look.beard) {
    ctx.fillStyle = `rgba(${hexToRgb(look.beard)},0.6)`;
    // Mandíbula + mentón
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.52, w * 0.13, h * 0.04, 0, 0, Math.PI);
    ctx.fill();
    // Patillas
    ctx.fillRect(cx - w * 0.16, h * 0.42, w * 0.025, h * 0.1);
    ctx.fillRect(cx + w * 0.135, h * 0.42, w * 0.025, h * 0.1);
    // Bigote
    if (susp.id === "victor") {
      ctx.fillStyle = `rgba(${hexToRgb(look.beard)},0.8)`;
      ctx.fillRect(cx - w * 0.05, h * 0.485, w * 0.1, h * 0.012);
    }
  }

  // ---- CARTEL DE FICHAJE ----
  drawMugshotPlaque(ctx, w, h, cx, susp, look);

  // ---- SELLO INTERROGADO ----
  if (susp._interviewed) {
    ctx.save();
    ctx.translate(w * 0.78, h * 0.17);
    ctx.rotate(-0.18);
    ctx.strokeStyle = "rgba(181,27,44,0.85)";
    ctx.fillStyle = "rgba(181,27,44,0.85)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-38, -11, 76, 22);
    ctx.font = "bold 10px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INTERROGADO", 0, 0);
    // Pequeña salpicadura para envejecer
    ctx.fillStyle = "rgba(181,27,44,0.5)";
    ctx.fillRect(-40, -13, 2, 26);
    ctx.fillRect(38, -13, 2, 26);
    ctx.restore();
  }

  // Iluminación cenital final
  topLight(ctx, w, h, "rgba(255,240,210,0.12)");
  // Vignette
  vignette(ctx, w, h, 0.45);
  // Grano de papel
  paperGrain(ctx, w, h, 0.08);
}

function drawClothing(ctx, w, h, cx, look) {
  // Sombra de hombros general
  const shGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
  shGrad.addColorStop(0, look.shirt);
  shGrad.addColorStop(1, look.shirtShadow);
  ctx.fillStyle = shGrad;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.5, h);
  ctx.lineTo(cx - w * 0.5, h * 0.82);
  ctx.quadraticCurveTo(cx - w * 0.4, h * 0.7, cx - w * 0.15, h * 0.7);
  ctx.lineTo(cx + w * 0.15, h * 0.7);
  ctx.quadraticCurveTo(cx + w * 0.4, h * 0.7, cx + w * 0.5, h * 0.82);
  ctx.lineTo(cx + w * 0.5, h);
  ctx.closePath();
  ctx.fill();

  if (look.style === "polo-stained") {
    // Cuello de polo socorrista (rojo) con manchas
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.12, h * 0.7);
    ctx.lineTo(cx - w * 0.08, h * 0.75);
    ctx.lineTo(cx + w * 0.08, h * 0.75);
    ctx.lineTo(cx + w * 0.12, h * 0.7);
    ctx.lineTo(cx + w * 0.07, h * 0.7);
    ctx.lineTo(cx, h * 0.72);
    ctx.lineTo(cx - w * 0.07, h * 0.7);
    ctx.closePath();
    ctx.fill();
    // Mancha de cloro
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.2, h * 0.85, w * 0.05, h * 0.03, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Logo
    ctx.fillStyle = "#fff";
    ctx.font = "bold 7px Arial";
    ctx.textAlign = "center";
    ctx.fillText("LIFEGUARD", cx + w * 0.22, h * 0.82);
  } else if (look.style === "hoodie") {
    // Capucha
    ctx.fillStyle = look.shirtShadow;
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.22, h * 0.7, w * 0.08, h * 0.12, -0.4, 0, Math.PI * 2);
    ctx.ellipse(cx + w * 0.22, h * 0.7, w * 0.08, h * 0.12, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Cordón
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.04, h * 0.74);
    ctx.lineTo(cx - w * 0.05, h * 0.84);
    ctx.moveTo(cx + w * 0.04, h * 0.74);
    ctx.lineTo(cx + w * 0.05, h * 0.84);
    ctx.stroke();
  } else if (look.style === "tank") {
    // Top, tirantes
    ctx.fillStyle = adjustColor(0x000000, 0) === "string" ? look.shirt : look.shirt;
    // Tirantes finos
    ctx.fillStyle = look.shirtShadow;
    ctx.fillRect(cx - w * 0.13, h * 0.7, w * 0.03, h * 0.06);
    ctx.fillRect(cx + w * 0.1, h * 0.7, w * 0.03, h * 0.06);
    // Escote
    ctx.fillStyle = look.skin;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.1, h * 0.72);
    ctx.quadraticCurveTo(cx, h * 0.82, cx + w * 0.1, h * 0.72);
    ctx.lineTo(cx + w * 0.1, h * 0.7);
    ctx.lineTo(cx - w * 0.1, h * 0.7);
    ctx.closePath();
    ctx.fill();
  } else if (look.style === "uniform") {
    // Uniforme verde de mantenimiento con parche
    ctx.fillStyle = "#3a4828";
    // Solapa
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.08, h * 0.7);
    ctx.lineTo(cx - w * 0.18, h * 0.85);
    ctx.lineTo(cx - w * 0.12, h * 0.86);
    ctx.lineTo(cx - w * 0.06, h * 0.74);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + w * 0.08, h * 0.7);
    ctx.lineTo(cx + w * 0.18, h * 0.85);
    ctx.lineTo(cx + w * 0.12, h * 0.86);
    ctx.lineTo(cx + w * 0.06, h * 0.74);
    ctx.closePath();
    ctx.fill();
    // Parche
    ctx.fillStyle = "#d4a754";
    ctx.fillRect(cx + w * 0.16, h * 0.78, w * 0.12, h * 0.05);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 6px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("MAINT.", cx + w * 0.22, h * 0.815);
  }
}

function drawHair(ctx, w, h, cx, look, id) {
  if (!look.hair) {
    // Calvo / canoso: dibujar coronilla brillante
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.04, h * 0.27, w * 0.07, h * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    // Patillas canosas
    if (look.beard) {
      ctx.fillStyle = look.beard;
      ctx.beginPath();
      ctx.arc(cx - w * 0.16, h * 0.4, w * 0.025, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.16, h * 0.4, w * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  const hairGrad = ctx.createLinearGradient(0, h * 0.18, 0, h * 0.4);
  hairGrad.addColorStop(0, look.hairHighlight);
  hairGrad.addColorStop(1, look.hair);
  ctx.fillStyle = hairGrad;

  if (id === "sara") {
    // Pelo largo cayendo a los hombros
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.3, w * 0.22, h * 0.17, 0, 0, Math.PI * 2);
    ctx.fill();
    // Caída
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.22, h * 0.3);
    ctx.quadraticCurveTo(cx - w * 0.3, h * 0.5, cx - w * 0.22, h * 0.7);
    ctx.lineTo(cx - w * 0.13, h * 0.7);
    ctx.quadraticCurveTo(cx - w * 0.18, h * 0.5, cx - w * 0.18, h * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + w * 0.22, h * 0.3);
    ctx.quadraticCurveTo(cx + w * 0.3, h * 0.5, cx + w * 0.22, h * 0.7);
    ctx.lineTo(cx + w * 0.13, h * 0.7);
    ctx.quadraticCurveTo(cx + w * 0.18, h * 0.5, cx + w * 0.18, h * 0.32);
    ctx.closePath();
    ctx.fill();
    // Reflejo lateral
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(cx - w * 0.2, h * 0.34, w * 0.03, h * 0.25);
  } else if (id === "marcos") {
    // Pelo corto rapado a los lados, top con volumen
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.28, w * 0.21, h * 0.11, 0, Math.PI, 0);
    ctx.fill();
    // Línea baja
    ctx.fillRect(cx - w * 0.19, h * 0.28, w * 0.38, h * 0.06);
  } else if (id === "daniel") {
    // Pelo medio, peinado lateral
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.3, w * 0.22, h * 0.13, 0, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
    // Onda
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.22, h * 0.32);
    ctx.quadraticCurveTo(cx - w * 0.1, h * 0.22, cx + w * 0.05, h * 0.28);
    ctx.quadraticCurveTo(cx + w * 0.2, h * 0.34, cx + w * 0.22, h * 0.42);
    ctx.lineTo(cx + w * 0.22, h * 0.32);
    ctx.closePath();
    ctx.fill();
  }
}

function drawEyes(ctx, w, h, cx, look) {
  const eyeY = h * 0.42;
  const eyeW = w * 0.05;
  const eyeH = h * 0.025;
  const lx = cx - w * 0.07;
  const rx = cx + w * 0.07;

  // Blanco del ojo
  ctx.fillStyle = "#ece2d0";
  ctx.beginPath();
  ctx.ellipse(lx, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
  ctx.ellipse(rx, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris
  ctx.fillStyle = look.eyeColor;
  ctx.beginPath();
  ctx.arc(lx, eyeY, eyeH * 0.85, 0, Math.PI * 2);
  ctx.arc(rx, eyeY, eyeH * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Pupila
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.arc(lx, eyeY, eyeH * 0.45, 0, Math.PI * 2);
  ctx.arc(rx, eyeY, eyeH * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Reflejos
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(lx + eyeH * 0.3, eyeY - eyeH * 0.3, eyeH * 0.18, 0, Math.PI * 2);
  ctx.arc(rx + eyeH * 0.3, eyeY - eyeH * 0.3, eyeH * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // Ojeras / bolsa
  if (look.expression === "tired" || look.expression === "guilty") {
    ctx.strokeStyle = `rgba(${hexToRgb(look.skinShadow)},0.55)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(lx, eyeY + eyeH * 1.5, eyeW * 0.9, Math.PI * 0.85, Math.PI * 0.15, true);
    ctx.arc(rx, eyeY + eyeH * 1.5, eyeW * 0.9, Math.PI * 0.85, Math.PI * 0.15, true);
    ctx.stroke();
  }

  // Párpado superior (sombra)
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(lx, eyeY, eyeW, Math.PI * 1.05, Math.PI * 1.95);
  ctx.arc(rx, eyeY, eyeW, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();

  // Pestañas
  ctx.strokeStyle = "rgba(0,0,0,0.7)";
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    const a = Math.PI * 1.5 + i * 0.15;
    [lx, rx].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * eyeW, eyeY + Math.sin(a) * eyeH);
      ctx.lineTo(x + Math.cos(a) * eyeW * 1.2, eyeY + Math.sin(a) * eyeH * 1.4 - 2);
      ctx.stroke();
    });
  }
}

function drawMouth(ctx, w, h, cx, look) {
  ctx.strokeStyle = "#5a2418";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (look.expression === "angry") {
    // Apretada, comisuras abajo
    ctx.moveTo(cx - w * 0.06, h * 0.515);
    ctx.quadraticCurveTo(cx, h * 0.5, cx + w * 0.06, h * 0.515);
  } else if (look.expression === "sad") {
    ctx.moveTo(cx - w * 0.05, h * 0.51);
    ctx.quadraticCurveTo(cx, h * 0.525, cx + w * 0.05, h * 0.51);
  } else if (look.expression === "guilty") {
    // Boca recta tensa
    ctx.moveTo(cx - w * 0.05, h * 0.51);
    ctx.lineTo(cx + w * 0.05, h * 0.512);
  } else {
    // Cansado / neutro
    ctx.moveTo(cx - w * 0.05, h * 0.505);
    ctx.quadraticCurveTo(cx, h * 0.515, cx + w * 0.05, h * 0.505);
  }
  ctx.stroke();
  // Labio inferior sombra
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.04, h * 0.525);
  ctx.quadraticCurveTo(cx, h * 0.535, cx + w * 0.04, h * 0.525);
  ctx.stroke();
}

function drawMugshotPlaque(ctx, w, h, cx, susp, look) {
  // Cartel en negro
  const plY = h * 0.86;
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(cx - w * 0.36, plY, w * 0.72, h * 0.11);
  // Borde
  ctx.strokeStyle = "#f4ecd8";
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - w * 0.36, plY, w * 0.72, h * 0.11);

  // Nombre
  ctx.fillStyle = "#f4ecd8";
  ctx.font = "bold 14px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(susp.name.toUpperCase(), cx, plY + h * 0.04);

  // Datos
  ctx.fillStyle = "rgba(244,236,216,0.7)";
  ctx.font = "9px Courier New";
  const code = susp.id.toUpperCase().padEnd(6, "0");
  ctx.fillText(`ID-${code} · ${look.age} AÑOS · ${susp.role.toUpperCase()}`, cx, plY + h * 0.08);
}

function brighten(hex, amount) {
  // hex tipo "#xxxxxx"
  if (hex.startsWith("#")) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.min(255, r + amount)},${Math.min(255, g + amount)},${Math.min(255, b + amount)})`;
  }
  return hex;
}

function hexToRgb(hex) {
  if (!hex.startsWith("#")) return "120,80,60";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ====================================================================
// EVIDENCIAS
// ====================================================================
export function drawEvidence(ctx, w, h, ev) {
  switch (ev.type) {
    case "body":
      drawBodyScene(ctx, w, h);
      break;
    case "blood":
      drawBloodScene(ctx, w, h);
      break;
    case "object":
      if (ev.id === "bracelet") drawBracelet(ctx, w, h);
      else if (ev.id === "phone") drawPhone(ctx, w, h);
      else if (ev.id === "keys") drawKeys(ctx, w, h);
      else if (ev.id === "paint") drawPaint(ctx, w, h);
      else drawObject(ctx, w, h, ev);
      break;
    default:
      drawObject(ctx, w, h, ev);
  }

  // Marco evidencia
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);

  vignette(ctx, w, h, 0.42);
  paperGrain(ctx, w, h, 0.06);
}

// ---- Cuerpo: piscina vista cenital con cuerpo y marcadores ----
function drawBodyScene(ctx, w, h) {
  // Suelo de baldosa beige
  const tileGrad = ctx.createLinearGradient(0, 0, w, h);
  tileGrad.addColorStop(0, "#bcb09a");
  tileGrad.addColorStop(1, "#9a8e78");
  ctx.fillStyle = tileGrad;
  ctx.fillRect(0, 0, w, h);

  // Baldosa grande
  const tileSize = Math.min(w, h) / 6;
  for (let x = 0; x < w + tileSize; x += tileSize) {
    for (let y = 0; y < h + tileSize; y += tileSize) {
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, tileSize, tileSize);
      // Variación de color por baldosa
      ctx.fillStyle = `rgba(${100 + Math.random() * 30},${90 + Math.random() * 30},${60 + Math.random() * 20},0.05)`;
      ctx.fillRect(x, y, tileSize, tileSize);
    }
  }
  // Sombra agua periférica
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, w, h);

  // Piscina con bordillo
  const pad = Math.min(w, h) * 0.08;
  const px = pad;
  const py = pad;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  // Bordillo
  ctx.fillStyle = "#e8d8b5";
  ctx.fillRect(px - 8, py - 8, pw + 16, 8);
  ctx.fillRect(px - 8, py + ph, pw + 16, 8);
  ctx.fillRect(px - 8, py - 8, 8, ph + 16);
  ctx.fillRect(px + pw, py - 8, 8, ph + 16);
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(px - 8, py - 8, pw + 16, ph + 16);

  // Agua — degradado profundo
  const water = ctx.createLinearGradient(0, py, 0, py + ph);
  water.addColorStop(0, "#2e7398");
  water.addColorStop(0.5, "#1d5a85");
  water.addColorStop(1, "#143e64");
  ctx.fillStyle = water;
  ctx.fillRect(px, py, pw, ph);

  // Patrón de fondo (baldosas bajo el agua)
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let x = px; x < px + pw; x += pw / 5) {
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x, py + ph);
    ctx.stroke();
  }
  for (let y = py; y < py + ph; y += ph / 5) {
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px + pw, y);
    ctx.stroke();
  }

  // Líneas de luz / refracción
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    const ox = px + Math.random() * pw;
    const oy = py + Math.random() * ph;
    ctx.moveTo(ox, oy);
    ctx.bezierCurveTo(
      ox + 20,
      oy + 10,
      ox + 40,
      oy + 5,
      ox + 60 + Math.random() * 30,
      oy + Math.random() * 15
    );
    ctx.stroke();
  }

  // Cuerpo (silueta sumergida)
  ctx.save();
  ctx.translate(w / 2, h * 0.55);
  ctx.rotate(-0.28);

  // Sombra del cuerpo
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.ellipse(2, 6, w * 0.16, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cuerpo flotando boca abajo (silueta clara, pelo flotando)
  ctx.fillStyle = "rgba(220,200,180,0.7)";
  // Cabeza
  ctx.beginPath();
  ctx.arc(0, -h * 0.18, w * 0.04, 0, Math.PI * 2);
  ctx.fill();
  // Pelo flotando
  ctx.fillStyle = "rgba(60,30,15,0.7)";
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.21, w * 0.07, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  // Hilos de pelo
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.21);
    ctx.bezierCurveTo(
      -w * 0.05 + i * w * 0.02,
      -h * 0.25,
      w * 0.02,
      -h * 0.27,
      -w * 0.04 + i * w * 0.015,
      -h * 0.3
    );
    ctx.strokeStyle = "rgba(60,30,15,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Torso (camiseta blanca empapada → translúcida)
  ctx.fillStyle = "rgba(244,236,216,0.5)";
  ctx.beginPath();
  ctx.moveTo(-w * 0.06, -h * 0.14);
  ctx.quadraticCurveTo(-w * 0.1, -h * 0.05, -w * 0.09, h * 0.08);
  ctx.lineTo(w * 0.09, h * 0.08);
  ctx.quadraticCurveTo(w * 0.1, -h * 0.05, w * 0.06, -h * 0.14);
  ctx.closePath();
  ctx.fill();
  // Brazos
  ctx.fillStyle = "rgba(220,200,180,0.6)";
  ctx.beginPath();
  ctx.ellipse(-w * 0.13, -h * 0.04, w * 0.025, h * 0.07, -0.3, 0, Math.PI * 2);
  ctx.ellipse(w * 0.14, -h * 0.05, w * 0.025, h * 0.06, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Piernas (jeans azul oscuro)
  ctx.fillStyle = "rgba(40,50,80,0.7)";
  ctx.fillRect(-w * 0.08, h * 0.08, w * 0.07, h * 0.14);
  ctx.fillRect(w * 0.01, h * 0.08, w * 0.07, h * 0.14);

  ctx.restore();

  // Mancha de sangre tenuemente disuelta cerca de la cabeza
  ctx.fillStyle = "rgba(120,30,30,0.35)";
  ctx.beginPath();
  ctx.ellipse(w * 0.43, h * 0.42, w * 0.08, h * 0.05, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Ondas del agua alrededor del cuerpo
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.55, w * (0.18 + i * 0.06), h * (0.22 + i * 0.05), -0.28, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Marcadores
  evidenceTag(ctx, w * 0.18, h * 0.2, "1", -0.05);
  evidenceTag(ctx, w * 0.82, h * 0.78, "2", 0.1);

  // Cinta policial
  ctx.save();
  ctx.translate(w * 0.5, h * 0.04);
  ctx.rotate(0.03);
  ctx.fillStyle = "#fce648";
  ctx.fillRect(-w * 0.6, 0, w * 1.2, 14);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 9px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = -2; i <= 2; i++) {
    ctx.fillText("POLICÍA · NO PASAR ·", i * w * 0.4, 7);
  }
  ctx.restore();
}

// ---- Sangre en la escalera del tobogán ----
function drawBloodScene(ctx, w, h) {
  // Cielo nocturno con estrellas leves
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  sky.addColorStop(0, "#0d1830");
  sky.addColorStop(1, "#1a2a48");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.6);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  for (let i = 0; i < 25; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h * 0.5, Math.random() * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Suelo con linterna
  const ground = ctx.createRadialGradient(w * 0.5, h * 0.95, h * 0.05, w * 0.5, h, h * 0.6);
  ground.addColorStop(0, "#5a4830");
  ground.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = ground;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // Tobogán azul (silueta detrás) en perspectiva
  ctx.fillStyle = "rgba(50,80,140,0.7)";
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.1);
  ctx.quadraticCurveTo(w * 0.8, h * 0.5, w * 0.65, h * 0.8);
  ctx.lineTo(w * 0.55, h * 0.8);
  ctx.quadraticCurveTo(w * 0.7, h * 0.5, w * 0.5, h * 0.1);
  ctx.closePath();
  ctx.fill();

  // Estructura metálica de la escalera (perspectiva ascendente)
  ctx.save();
  ctx.translate(w * 0.5, h * 0.55);
  for (let i = 0; i < 12; i++) {
    const t = i / 12;
    const sx = -w * (0.35 - t * 0.28);
    const ex = w * (0.35 - t * 0.28);
    const sy = h * (0.35 - t * 0.35);
    // Escalón
    const stairGrad = ctx.createLinearGradient(0, sy, 0, sy + 6);
    stairGrad.addColorStop(0, "#9a9e9a");
    stairGrad.addColorStop(1, "#5a5e5a");
    ctx.fillStyle = stairGrad;
    ctx.fillRect(sx, sy, ex - sx, 6);
    // Sombra bajo el escalón
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(sx, sy + 6, ex - sx, 4);
    // Antideslizante
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 0.8;
    for (let n = 0; n < 6; n++) {
      const lx = sx + (n / 6) * (ex - sx);
      ctx.beginPath();
      ctx.moveTo(lx, sy + 1);
      ctx.lineTo(lx + 2, sy + 5);
      ctx.stroke();
    }
  }

  // Barandillas
  ctx.strokeStyle = "#bcc0c4";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-w * 0.36, h * 0.36);
  ctx.lineTo(-w * 0.07, -h * 0.05);
  ctx.moveTo(w * 0.36, h * 0.36);
  ctx.lineTo(w * 0.07, -h * 0.05);
  ctx.stroke();
  // Barras verticales
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const t = i / 12;
    const sx = -w * (0.36 - t * 0.29);
    const sy = h * (0.36 - t * 0.41);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + 18 - t * 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-sx, sy);
    ctx.lineTo(-sx, sy + 18 - t * 12);
    ctx.stroke();
  }
  ctx.restore();

  // Sangre en lo alto (escalón superior, foco principal)
  bloodSplat(ctx, w * 0.5, h * 0.22, 18, 0.95);
  bloodSplat(ctx, w * 0.42, h * 0.18, 8, 0.7);
  bloodSplat(ctx, w * 0.6, h * 0.26, 6, 0.5);

  // Goteo descendente
  ctx.fillStyle = "rgba(120,15,20,0.7)";
  for (let i = 0; i < 8; i++) {
    const y = h * (0.27 + i * 0.06);
    const x = w * 0.5 + Math.sin(i * 0.8) * 8;
    ctx.beginPath();
    ctx.ellipse(x, y, 2.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Charco al pie
  ctx.fillStyle = "rgba(80,5,10,0.85)";
  ctx.beginPath();
  ctx.ellipse(w * 0.51, h * 0.86, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Linterna del forense
  const torchGrad = ctx.createRadialGradient(w * 0.5, h * 0.22, 8, w * 0.5, h * 0.22, w * 0.45);
  torchGrad.addColorStop(0, "rgba(255,235,180,0.45)");
  torchGrad.addColorStop(1, "rgba(255,235,180,0)");
  ctx.fillStyle = torchGrad;
  ctx.fillRect(0, 0, w, h);

  evidenceTag(ctx, w * 0.15, h * 0.16, "3", -0.1);

  // Cinta policial diagonal
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-0.4);
  ctx.fillStyle = "#fce648";
  ctx.fillRect(-w, h * 0.36, w * 2, 12);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 8px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = -4; i <= 4; i++) {
    ctx.fillText("POLICÍA · NO PASAR ·", i * w * 0.3, h * 0.42);
  }
  ctx.restore();
}

// ---- Pulsera de plata sobre mesa forense ----
function drawBracelet(ctx, w, h) {
  // Mesa de evidencias (negra mate)
  const tableGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w);
  tableGrad.addColorStop(0, "#1a1a1a");
  tableGrad.addColorStop(1, "#050505");
  ctx.fillStyle = tableGrad;
  ctx.fillRect(0, 0, w, h);

  // Regla de evidencia
  ctx.fillStyle = "#e8d8b0";
  ctx.fillRect(0, h - 22, w, 22);
  ctx.fillStyle = "#1a1a1a";
  for (let x = 0; x < w; x += 6) {
    const big = x % 60 === 0;
    ctx.fillRect(x, h - 22, 1, big ? 12 : 6);
  }
  ctx.font = "bold 7px Courier New";
  ctx.fillStyle = "#1a1a1a";
  for (let x = 0; x < w; x += 60) {
    ctx.fillText(`${x / 6}`, x + 2, h - 4);
  }

  // Sombra del objeto sobre la mesa
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.save();
  ctx.translate(w / 2 + 4, h * 0.5 + 8);
  ctx.rotate(-0.18);
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.4, h * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Pulsera de plata con eslabones detallados
  ctx.save();
  ctx.translate(w / 2, h * 0.45);
  ctx.rotate(-0.18);

  const linkN = 12;
  const linkW = w * 0.06;
  // Hilo posterior
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = -linkN; i <= linkN; i++) {
    const x = i * (linkW / 2);
    const y = Math.sin(i * 0.4) * 4;
    if (i === -linkN) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Eslabones (ovalados)
  for (let i = -linkN; i <= linkN; i++) {
    const x = i * (linkW / 2);
    const y = Math.sin(i * 0.4) * 4;
    const isOdd = Math.abs(i) % 2 === 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(isOdd ? Math.PI / 2 : 0);
    // Sombra externa
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.beginPath();
    ctx.ellipse(0, 1, linkW * 0.55, linkW * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cuerpo del eslabón
    const gradE = ctx.createLinearGradient(0, -linkW * 0.3, 0, linkW * 0.3);
    gradE.addColorStop(0, "#f0f4f8");
    gradE.addColorStop(0.5, "#bcc0c8");
    gradE.addColorStop(1, "#6a6e74");
    ctx.fillStyle = gradE;
    ctx.beginPath();
    ctx.ellipse(0, 0, linkW * 0.55, linkW * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hueco interior
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.ellipse(0, 0, linkW * 0.32, linkW * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Brillo
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(-linkW * 0.4, -linkW * 0.22, linkW * 0.6, linkW * 0.08);
    ctx.restore();
  }

  // Placa central con iniciales
  ctx.save();
  ctx.translate(0, 0);
  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(-32, -8, 64, 24);
  // Placa
  const plateGrad = ctx.createLinearGradient(0, -10, 0, 14);
  plateGrad.addColorStop(0, "#f4f6f8");
  plateGrad.addColorStop(0.5, "#d4d8de");
  plateGrad.addColorStop(1, "#8a8e94");
  ctx.fillStyle = plateGrad;
  ctx.fillRect(-30, -10, 60, 22);
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(-30, -10, 60, 22);
  // Grabado
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "italic bold 16px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("V·A", 0, 2);
  // Brillo
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 0.8;
  ctx.strokeRect(-29, -9, 58, 5);
  ctx.restore();

  ctx.restore();

  // Eslabón roto aparte
  ctx.save();
  ctx.translate(w * 0.78, h * 0.32);
  ctx.rotate(0.6);
  ctx.fillStyle = "#bcc0c8";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 1.4);
  ctx.fill();
  ctx.strokeStyle = "#3a3e44";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // Foco de luz cenital de mesa de evidencias
  const lamp = ctx.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h * 0.4, w * 0.6);
  lamp.addColorStop(0, "rgba(255,235,180,0.25)");
  lamp.addColorStop(1, "rgba(255,235,180,0)");
  ctx.fillStyle = lamp;
  ctx.fillRect(0, 0, w, h);

  evidenceTag(ctx, w * 0.14, h * 0.18, "3", -0.08);
}

// ---- Móvil con mensaje borrado ----
function drawPhone(ctx, w, h) {
  // Mesa de madera
  const wood = ctx.createLinearGradient(0, 0, 0, h);
  wood.addColorStop(0, "#3a2818");
  wood.addColorStop(1, "#1a0e08");
  ctx.fillStyle = wood;
  ctx.fillRect(0, 0, w, h);
  // Vetas de la madera
  ctx.strokeStyle = "rgba(70,40,20,0.4)";
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (h / 8) * i + Math.random() * 4);
    ctx.bezierCurveTo(
      w * 0.3,
      (h / 8) * i + Math.random() * 6,
      w * 0.7,
      (h / 8) * i + Math.random() * 6,
      w,
      (h / 8) * i + Math.random() * 4
    );
    ctx.stroke();
  }

  // Sombra del móvil
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.save();
  ctx.translate(w / 2 + 6, h / 2 + 8);
  ctx.rotate(0.15);
  roundRect(ctx, -65, -118, 130, 234, 18, true);
  ctx.restore();

  // Móvil
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(0.15);

  // Carcasa
  const caseGrad = ctx.createLinearGradient(-65, 0, 65, 0);
  caseGrad.addColorStop(0, "#1a1a1a");
  caseGrad.addColorStop(0.5, "#2a2a2a");
  caseGrad.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = caseGrad;
  roundRect(ctx, -65, -118, 130, 234, 18, true);
  // Borde
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1.5;
  roundRect(ctx, -65, -118, 130, 234, 18, false);
  // Brillo lateral
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(-66, -110, 2, 220);

  // Pantalla
  const screen = ctx.createLinearGradient(0, -110, 0, 110);
  screen.addColorStop(0, "#1a2438");
  screen.addColorStop(1, "#0a1020");
  ctx.fillStyle = screen;
  roundRect(ctx, -57, -107, 114, 212, 6, true);

  // Notch
  ctx.fillStyle = "#000";
  roundRect(ctx, -18, -107, 36, 8, 3, true);

  // Barra de estado
  ctx.fillStyle = "rgba(244,236,216,0.7)";
  ctx.font = "bold 8px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("00:51", 0, -90);
  ctx.textAlign = "right";
  ctx.fillText("4G ●●●", 48, -90);
  ctx.textAlign = "left";
  ctx.fillText("◐", -48, -90);

  // Cabecera de chat
  ctx.fillStyle = "rgba(244,236,216,0.85)";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Sara ●", 0, -72);
  ctx.font = "7px Arial";
  ctx.fillStyle = "rgba(244,236,216,0.4)";
  ctx.fillText("en línea", 0, -62);
  // Separador
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-50, -57);
  ctx.lineTo(50, -57);
  ctx.stroke();

  // Burbujas de chat anteriores (en gris claro)
  ctx.fillStyle = "rgba(60,72,90,0.95)";
  roundRect(ctx, -50, -50, 60, 18, 8, true);
  ctx.fillStyle = "rgba(244,236,216,0.85)";
  ctx.textAlign = "left";
  ctx.font = "7px Arial";
  ctx.fillText("¿estás bien?", -45, -39);
  ctx.fillText("¿qué pasa?", -45, -34);

  // Mensaje saliente borrado (en sombra)
  ctx.fillStyle = "rgba(80,120,180,0.6)";
  roundRect(ctx, -2, -22, 52, 32, 8, true);
  ctx.fillStyle = "rgba(244,236,216,0.5)";
  ctx.font = "italic 6px Arial";
  ctx.textAlign = "left";
  ctx.fillText('"Tengo pruebas,', 3, -12);
  ctx.fillText('esta noche se', 3, -5);
  ctx.fillText('acaba"', 3, 2);
  // Sello "ELIMINADO"
  ctx.save();
  ctx.translate(24, -7);
  ctx.rotate(-0.15);
  ctx.strokeStyle = "rgba(220,80,80,0.85)";
  ctx.fillStyle = "rgba(220,80,80,0.85)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-30, -7, 60, 12);
  ctx.font = "bold 6px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ELIMINADO", 0, 0);
  ctx.restore();

  // Llamada perdida
  ctx.fillStyle = "rgba(220,80,80,0.18)";
  roundRect(ctx, -45, 20, 90, 28, 6, true);
  ctx.fillStyle = "#dc5050";
  ctx.font = "bold 9px Arial";
  ctx.textAlign = "center";
  ctx.fillText("☎ Llamada perdida", 0, 32);
  ctx.fillStyle = "rgba(244,236,216,0.6)";
  ctx.font = "7px Arial";
  ctx.fillText("Núm. desconocido · 01:08", 0, 42);

  // Hora actual del último uso
  ctx.fillStyle = "rgba(244,236,216,0.5)";
  ctx.font = "italic 6px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Visto a las 00:52", 0, 60);

  // Bordillo iluminado en pantalla
  ctx.strokeStyle = "rgba(80,140,200,0.25)";
  ctx.lineWidth = 0.8;
  roundRect(ctx, -56, -106, 112, 210, 5, false);

  // Botón inferior
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(0, 110, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Gotas de agua sobre la pantalla
  ctx.fillStyle = "rgba(160,200,230,0.5)";
  for (let i = 0; i < 12; i++) {
    const x = w * 0.35 + Math.random() * w * 0.3;
    const y = h * 0.15 + Math.random() * h * 0.7;
    const r = 1.5 + Math.random() * 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    // Reflejo
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(160,200,230,0.5)";
  }

  // Polvo de huella forense
  ctx.fillStyle = "rgba(200,200,200,0.18)";
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  evidenceTag(ctx, w * 0.84, h * 0.85, "4", 0.08);
}

// ---- Llaves dentro del hueco del extintor ----
function drawKeys(ctx, w, h) {
  // Pared roja (zona de extintor)
  const wall = ctx.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, "#a83a2a");
  wall.addColorStop(1, "#5a1a10");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, h);

  // Hueco oscuro del extintor (cavidad)
  ctx.fillStyle = "#1a0a08";
  ctx.fillRect(w * 0.08, h * 0.15, w * 0.84, h * 0.6);
  // Sombra interior
  const cav = ctx.createRadialGradient(w / 2, h * 0.45, 10, w / 2, h * 0.45, w * 0.55);
  cav.addColorStop(0, "rgba(80,60,40,0.4)");
  cav.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = cav;
  ctx.fillRect(w * 0.08, h * 0.15, w * 0.84, h * 0.6);

  // Marco metálico del extintor (rotos los tornillos)
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 4;
  ctx.strokeRect(w * 0.08, h * 0.15, w * 0.84, h * 0.6);
  ctx.fillStyle = "#4a4a4a";
  // Tornillos en esquinas
  [
    [0.1, 0.17],
    [0.88, 0.17],
    [0.1, 0.72],
    [0.88, 0.72],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(w * x, h * y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(w * x - 2, h * y);
    ctx.lineTo(w * x + 2, h * y);
    ctx.moveTo(w * x, h * y - 2);
    ctx.lineTo(w * x, h * y + 2);
    ctx.stroke();
  });

  // Texto en la pared
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "bold 11px Courier New";
  ctx.textAlign = "left";
  ctx.fillText("EXTINTOR", w * 0.1, h * 0.12);
  // Símbolo de fuego
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "bold 11px serif";
  ctx.fillText("△", w * 0.85, h * 0.12);

  // Llaves dentro del hueco
  ctx.save();
  ctx.translate(w / 2, h * 0.45);
  ctx.rotate(-0.25);

  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.beginPath();
  ctx.ellipse(4, 12, 65, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Anilla
  const ringGrad = ctx.createLinearGradient(0, -10, 0, 10);
  ringGrad.addColorStop(0, "#e8c870");
  ringGrad.addColorStop(0.5, "#b89638");
  ringGrad.addColorStop(1, "#6a5418");
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.stroke();

  // Llave 1 (latón pulido)
  drawSingleKey(ctx, -60, -8, "#d4a754", "#8a6a28", 0.15, "SPLASH");

  // Llave 2 (duplicada, más oscura)
  drawSingleKey(ctx, 48, 22, "#a08038", "#5a4418", 0.6, null);

  // Llave 3 (pequeña, candado)
  drawSingleKey(ctx, -20, 30, "#9a7e30", "#4a3818", -0.4, null, 0.6);

  // Etiqueta colgante
  ctx.save();
  ctx.translate(35, -15);
  ctx.rotate(0.4);
  // Cordel
  ctx.strokeStyle = "#aa8848";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-15, -10);
  ctx.lineTo(0, 0);
  ctx.stroke();
  // Etiqueta
  ctx.fillStyle = "#e8d8b0";
  ctx.fillRect(0, 0, 32, 16);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 0.6;
  ctx.strokeRect(0, 0, 32, 16);
  // Texto
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 7px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("DUPL.", 16, 10);
  // Agujero
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(4, 8, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // Polvo
  ctx.fillStyle = "rgba(200,200,200,0.15)";
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Foco interno
  const beam = ctx.createRadialGradient(w / 2, h * 0.45, 5, w / 2, h * 0.45, w * 0.4);
  beam.addColorStop(0, "rgba(255,210,140,0.18)");
  beam.addColorStop(1, "rgba(255,210,140,0)");
  ctx.fillStyle = beam;
  ctx.fillRect(0, 0, w, h);

  evidenceTag(ctx, w * 0.14, h * 0.85, "5", 0.05);
}

function drawSingleKey(ctx, x, y, fillColor, shadowColor, rot = 0, label = null, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);

  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.ellipse(2, 3, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cabeza (anillo)
  const headGrad = ctx.createRadialGradient(-22, -3, 2, -22, -3, 18);
  headGrad.addColorStop(0, "#fff2a8");
  headGrad.addColorStop(0.4, fillColor);
  headGrad.addColorStop(1, shadowColor);
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(-22, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  // Agujero
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(-22, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  // Brillo
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.arc(-26, -4, 2, 0, Math.PI * 2);
  ctx.fill();

  // Cuello (vástago)
  const stemGrad = ctx.createLinearGradient(0, -4, 0, 4);
  stemGrad.addColorStop(0, fillColor);
  stemGrad.addColorStop(1, shadowColor);
  ctx.fillStyle = stemGrad;
  ctx.fillRect(-12, -3, 32, 6);

  // Dientes
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(20, -3);
  ctx.lineTo(28, -3);
  ctx.lineTo(28, 1);
  ctx.lineTo(24, 1);
  ctx.lineTo(24, 4);
  ctx.lineTo(20, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(8, 3, 4, 5);
  ctx.fillRect(14, 3, 4, 7);

  // Brillo lineal en el cuerpo
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(-10, -2.5, 30, 1);

  if (label) {
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 5px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(label, -22, 1);
  }

  ctx.restore();
}

// ---- Bote de pintura azul abierto ----
function drawPaint(ctx, w, h) {
  // Suelo de almacén (cemento)
  const floor = ctx.createLinearGradient(0, 0, 0, h);
  floor.addColorStop(0, "#6a5848");
  floor.addColorStop(1, "#3a2a1c");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, w, h);

  // Manchas y suciedad del suelo
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(${30 + Math.random() * 40},${20 + Math.random() * 20},${10 + Math.random() * 10},0.3)`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sombra del bote
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.ellipse(w * 0.5 + 8, h * 0.78, w * 0.32, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chorretón de pintura azul (debajo del bote, en el suelo)
  ctx.save();
  ctx.translate(w * 0.5, h * 0.62);
  ctx.fillStyle = "#1e5fa8";
  ctx.beginPath();
  ctx.moveTo(-50, 8);
  ctx.bezierCurveTo(-90, 30, -110, 20, -130, 40);
  ctx.bezierCurveTo(-120, 50, -100, 45, -80, 38);
  ctx.bezierCurveTo(-60, 32, -30, 25, -10, 18);
  ctx.lineTo(50, 18);
  ctx.bezierCurveTo(80, 22, 110, 28, 130, 35);
  ctx.bezierCurveTo(100, 30, 70, 25, 40, 22);
  ctx.lineTo(30, 24);
  ctx.bezierCurveTo(60, 50, 100, 60, 80, 80);
  ctx.lineTo(60, 70);
  ctx.bezierCurveTo(40, 50, 0, 38, -20, 30);
  ctx.closePath();
  ctx.fill();
  // Brillo charco
  ctx.fillStyle = "rgba(120,180,240,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 30, 60, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Bote
  ctx.save();
  ctx.translate(w / 2, h * 0.42);

  // Cuerpo del bote (cilindro)
  const canGrad = ctx.createLinearGradient(-55, 0, 55, 0);
  canGrad.addColorStop(0, "#1a1a1a");
  canGrad.addColorStop(0.3, "#3a3a3a");
  canGrad.addColorStop(0.5, "#5a5a5a");
  canGrad.addColorStop(0.7, "#3a3a3a");
  canGrad.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = canGrad;
  ctx.fillRect(-55, -10, 110, 130);
  // Borde inferior con reflejo
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(-55, 115, 110, 6);
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(-55, 117, 110, 1);

  // Tapa abierta (medio levantada)
  ctx.save();
  ctx.translate(0, -10);
  ctx.rotate(-0.15);
  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(-62, -16, 124, 14);
  // Tapa metálica
  const lidGrad = ctx.createLinearGradient(0, -18, 0, -4);
  lidGrad.addColorStop(0, "#4a4a4a");
  lidGrad.addColorStop(0.5, "#7a7a7a");
  lidGrad.addColorStop(1, "#2a2a2a");
  ctx.fillStyle = lidGrad;
  ctx.fillRect(-60, -16, 120, 14);
  // Reborde
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(-60, -16, 120, 2);
  // Pintura azul en la tapa
  ctx.fillStyle = "#1e5fa8";
  ctx.beginPath();
  ctx.ellipse(15, -8, 25, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Asa metálica
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, -18, 42, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  ctx.strokeStyle = "#5a5a5a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -18, 42, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  // Anclajes del asa
  ctx.fillStyle = "#3a3a3a";
  ctx.beginPath();
  ctx.arc(-42, -10, 4, 0, Math.PI * 2);
  ctx.arc(42, -10, 4, 0, Math.PI * 2);
  ctx.fill();

  // Etiqueta principal
  ctx.fillStyle = "#f4ecd8";
  ctx.fillRect(-44, 15, 88, 78);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;
  ctx.strokeRect(-44, 15, 88, 78);
  // Esquina manchada
  ctx.fillStyle = "rgba(120,80,40,0.3)";
  ctx.beginPath();
  ctx.moveTo(-44, 90);
  ctx.lineTo(-30, 93);
  ctx.lineTo(-44, 93);
  ctx.closePath();
  ctx.fill();

  // Banda de color
  const labelBlue = ctx.createLinearGradient(0, 22, 0, 42);
  labelBlue.addColorStop(0, "#3a8acc");
  labelBlue.addColorStop(1, "#1e5fa8");
  ctx.fillStyle = labelBlue;
  ctx.fillRect(-40, 22, 80, 22);
  // Marca / Logo
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.fillText("AZUL ARQ.", 0, 36);
  // Línea decorativa
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-32, 40);
  ctx.lineTo(32, 40);
  ctx.stroke();

  // Especificaciones
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 8px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("AC-2080", 0, 56);
  ctx.font = "6px Courier New";
  ctx.fillText("MANTENIMIENTO", 0, 66);
  ctx.fillText("4 L · INTERIOR", 0, 74);

  // Símbolo riesgo
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-32, 78);
  ctx.lineTo(-26, 88);
  ctx.lineTo(-38, 88);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 7px Arial";
  ctx.fillText("!", -32, 86);

  // Código de barras
  ctx.fillStyle = "#1a1a1a";
  for (let i = 0; i < 14; i++) {
    const bw = 1 + Math.random() * 2;
    ctx.fillRect(20 + i * 1.3, 78, bw * 0.8, 10);
  }

  // Salpicaduras de pintura sobre la etiqueta
  ctx.fillStyle = "rgba(30,95,168,0.85)";
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(-44 + Math.random() * 88, 15 + Math.random() * 78, 1 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Huella dactilar parcial sobre la etiqueta
  ctx.strokeStyle = "rgba(70,40,20,0.5)";
  ctx.lineWidth = 0.6;
  ctx.save();
  ctx.translate(-20, 75);
  ctx.rotate(0.4);
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, 3 + i * 1.4, Math.PI * 0.2, Math.PI * 1.3);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();

  evidenceTag(ctx, w * 0.84, h * 0.16, "6", -0.08);
}

function drawObject(ctx, w, h, ev) {
  ctx.fillStyle = "#2a2418";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#" + (ev.color || 0x888888).toString(16).padStart(6, "0");
  ctx.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.4);
}

// ====================================================================
// Partículas de polvo flotante en haz de luz
// ====================================================================
export class DustParticles {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.count = opts.count || 60;
    this.color = opts.color || "rgba(255,210,138,0.7)";
    this.lightX = opts.lightX || 0.5;
    this.particles = [];
    this.running = false;
    this._init();
  }

  _init() {
    this.resize();
    for (let i = 0; i < this.count; i++) {
      this.particles.push(this._spawn());
    }
  }

  _spawn() {
    const w = this.w;
    const h = this.h;
    const cx = w * this.lightX;
    const spread = w * 0.4;
    return {
      x: cx + (Math.random() - 0.5) * spread * 1.5,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.05 - Math.random() * 0.18,
      a: 0.2 + Math.random() * 0.6,
      drift: Math.random() * Math.PI * 2,
    };
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.w = r.width;
    this.h = r.height;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const tick = () => {
      if (!this.running) return;
      this.draw();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
  }

  draw() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      p.drift += 0.01;
      p.x += p.vx + Math.sin(p.drift) * 0.05;
      p.y += p.vy;
      if (p.y < -10) {
        Object.assign(p, this._spawn(), { y: h + 5 });
      }
      const cx = w * this.lightX;
      const dx = (p.x - cx) / (w * 0.5);
      const glow = Math.max(0, 1 - Math.abs(dx));
      const alphaVal = (p.a * glow).toFixed(2);
      ctx.fillStyle = this.color.replace(/0?\.[0-9]+\)/, `${alphaVal})`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
