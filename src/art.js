// Ilustraciones generadas en canvas — estilo noir / expediente.
// Cada función recibe (ctx, w, h) y dibuja una "foto" estilizada.

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
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.7
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function nightSky(ctx, w, h, tint = "#162033") {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0a1226");
  g.addColorStop(0.6, tint);
  g.addColorStop(1, "#040810");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function bgFloor(ctx, w, h, color = "#2a3850") {
  ctx.fillStyle = color;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);
}

function bloodSplat(ctx, x, y, r, alpha = 1) {
  ctx.fillStyle = `rgba(120,15,20,${alpha})`;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rr = r * (0.7 + Math.random() * 0.6);
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  // gotitas
  for (let i = 0; i < 6; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = r * (1.4 + Math.random() * 1.6);
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.2 * Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }
}

function evidenceTag(ctx, x, y, text) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.05);
  ctx.fillStyle = "#f4ecd8";
  ctx.fillRect(-22, -12, 44, 24);
  ctx.strokeStyle = "#1c1810";
  ctx.lineWidth = 2;
  ctx.strokeRect(-22, -12, 44, 24);
  ctx.fillStyle = "#1c1810";
  ctx.font = "bold 14px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 1);
  ctx.restore();
}

// ----------------------------------------------------------------
// Ilustraciones de SOSPECHOSOS — retratos estilizados
// ----------------------------------------------------------------
export function drawSuspectPortrait(ctx, w, h, susp) {
  // Fondo gris carbón / azul
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#3a3038");
  g.addColorStop(1, "#1a1418");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Vignette
  vignette(ctx, w, h, 0.5);

  // Líneas de altura (foto de fichaje)
  ctx.strokeStyle = "rgba(244,236,216,0.18)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 8; i++) {
    const y = (i / 8) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Sombra de hombros
  const cx = w / 2;
  const baseY = h * 0.9;

  // Hombros
  ctx.fillStyle = adjustColor(susp.color, -40);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.45, baseY);
  ctx.lineTo(cx - w * 0.3, h * 0.7);
  ctx.lineTo(cx + w * 0.3, h * 0.7);
  ctx.lineTo(cx + w * 0.45, baseY);
  ctx.lineTo(cx + w * 0.45, h);
  ctx.lineTo(cx - w * 0.45, h);
  ctx.closePath();
  ctx.fill();

  // Cuello
  ctx.fillStyle = "#d4a085";
  ctx.fillRect(cx - w * 0.08, h * 0.55, w * 0.16, h * 0.18);

  // Cabeza
  ctx.fillStyle = "#d4a085";
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.4, w * 0.18, h * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pelo (depende del sospechoso)
  ctx.fillStyle = susp.hairColor || "#2b1a0e";
  ctx.beginPath();
  if (susp.id === "sara") {
    // pelo largo
    ctx.ellipse(cx, h * 0.3, w * 0.21, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - w * 0.21, h * 0.3, w * 0.42, h * 0.25);
  } else if (susp.id === "marcos") {
    // pelo corto + barba
    ctx.ellipse(cx, h * 0.3, w * 0.2, h * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, h * 0.5, w * 0.13, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.fill();
  } else if (susp.id === "daniel") {
    ctx.ellipse(cx, h * 0.3, w * 0.2, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (susp.id === "victor") {
    // calvo + barba canosa
    ctx.fillStyle = "#9a8a78";
    ctx.beginPath();
    ctx.arc(cx, h * 0.55, w * 0.16, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.fill();
  }

  // Ojos
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(cx - w * 0.09, h * 0.4, w * 0.05, h * 0.022);
  ctx.fillRect(cx + w * 0.04, h * 0.4, w * 0.05, h * 0.022);

  // Mirada — reflejo
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillRect(cx - w * 0.075, h * 0.402, w * 0.012, h * 0.01);
  ctx.fillRect(cx + w * 0.055, h * 0.402, w * 0.012, h * 0.01);

  // Boca
  ctx.strokeStyle = "#5a2a1a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.05, h * 0.5);
  ctx.lineTo(cx + w * 0.05, h * 0.5);
  ctx.stroke();

  // Marco / Cartel de fichaje
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(cx - w * 0.25, h * 0.88, w * 0.5, h * 0.08);
  ctx.fillStyle = "#f4ecd8";
  ctx.font = "bold 16px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    susp.name.toUpperCase(),
    cx,
    h * 0.92
  );

  // Sello rojo "interrogado" si aplica
  if (susp._interviewed) {
    ctx.save();
    ctx.translate(w * 0.78, h * 0.18);
    ctx.rotate(-0.2);
    ctx.strokeStyle = "rgba(181,27,44,0.85)";
    ctx.fillStyle = "rgba(181,27,44,0.85)";
    ctx.lineWidth = 3;
    ctx.strokeRect(-36, -12, 72, 24);
    ctx.font = "bold 11px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INTERROGADO", 0, 0);
    ctx.restore();
  }

  // Grano de papel
  paperGrain(ctx, w, h, 0.08);
}

// ----------------------------------------------------------------
// Ilustraciones de EVIDENCIAS
// ----------------------------------------------------------------
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
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);

  vignette(ctx, w, h, 0.45);
  paperGrain(ctx, w, h, 0.07);
}

function drawBodyScene(ctx, w, h) {
  // Foto cenital de la piscina con cuerpo
  // Suelo de baldosa
  ctx.fillStyle = "#a8a092";
  ctx.fillRect(0, 0, w, h);
  // baldosas
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += w / 6) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += h / 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Piscina (agua)
  const pad = Math.min(w, h) * 0.12;
  ctx.fillStyle = "#3a7fa8";
  ctx.fillRect(pad, pad, w - pad * 2, h - pad * 2);
  ctx.fillStyle = "rgba(140,200,230,0.18)";
  for (let i = 0; i < 10; i++) {
    const x = pad + Math.random() * (w - pad * 2);
    const y = pad + Math.random() * (h - pad * 2);
    ctx.fillRect(x, y, 20 + Math.random() * 30, 2);
  }

  // Bordillo
  ctx.strokeStyle = "#e0d4b0";
  ctx.lineWidth = 6;
  ctx.strokeRect(pad - 3, pad - 3, w - pad * 2 + 6, h - pad * 2 + 6);

  // Cuerpo (silueta blanca tiza)
  ctx.save();
  ctx.translate(w / 2, h * 0.55);
  ctx.rotate(-0.3);
  ctx.strokeStyle = "#f4ecd8";
  ctx.lineWidth = 3;
  // Cabeza
  ctx.beginPath();
  ctx.arc(0, -40, 14, 0, Math.PI * 2);
  ctx.stroke();
  // Torso
  ctx.beginPath();
  ctx.moveTo(-20, -28);
  ctx.lineTo(-30, 30);
  ctx.lineTo(30, 30);
  ctx.lineTo(20, -28);
  ctx.closePath();
  ctx.stroke();
  // Brazos
  ctx.beginPath();
  ctx.moveTo(-20, -25);
  ctx.lineTo(-50, 20);
  ctx.moveTo(20, -25);
  ctx.lineTo(50, 20);
  ctx.stroke();
  // Piernas
  ctx.beginPath();
  ctx.moveTo(-25, 30);
  ctx.lineTo(-32, 80);
  ctx.moveTo(25, 30);
  ctx.lineTo(32, 80);
  ctx.stroke();
  ctx.restore();

  // Marcador
  evidenceTag(ctx, w * 0.18, h * 0.2, "1");
  evidenceTag(ctx, w * 0.78, h * 0.78, "2");
}

function drawBloodScene(ctx, w, h) {
  // Escalera del tobogán vista desde abajo
  ctx.fillStyle = "#2a3848";
  ctx.fillRect(0, 0, w, h);
  // Sky
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  g.addColorStop(0, "#3a4a64");
  g.addColorStop(1, "#1a202a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h * 0.5);

  // Estructura (metálica)
  ctx.fillStyle = "#3a4a5e";
  ctx.fillRect(w * 0.45, 0, w * 0.1, h);
  // Escalones (perspectiva)
  ctx.fillStyle = "#7a8090";
  for (let i = 0; i < 10; i++) {
    const t = i / 10;
    const x = w * (0.3 - t * 0.05);
    const y = h * (0.1 + t * 0.075);
    const sw = w * (0.4 + t * 0.05);
    ctx.fillRect(x, y, sw, 4);
    ctx.fillStyle = i % 2 === 0 ? "#7a8090" : "#6a7080";
  }

  // Barandilla
  ctx.strokeStyle = "#cdd1d8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.25, h * 0.92);
  ctx.lineTo(w * 0.3, h * 0.1);
  ctx.moveTo(w * 0.75, h * 0.92);
  ctx.lineTo(w * 0.7, h * 0.1);
  ctx.stroke();

  // Sangre en el escalón superior
  bloodSplat(ctx, w * 0.45, h * 0.22, 14, 0.9);
  bloodSplat(ctx, w * 0.55, h * 0.28, 8, 0.7);
  // Goteo descendente
  ctx.fillStyle = "rgba(120,15,20,0.65)";
  for (let i = 0; i < 6; i++) {
    const y = h * (0.3 + i * 0.07);
    ctx.beginPath();
    ctx.ellipse(w * 0.48 + Math.random() * 8, y, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  evidenceTag(ctx, w * 0.78, h * 0.22, "3");
}

function drawBracelet(ctx, w, h) {
  // Mesa de evidencias (negra)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);
  // Regla en el borde
  ctx.fillStyle = "#e0d8b0";
  ctx.fillRect(0, h - 18, w, 18);
  ctx.fillStyle = "#1a1a1a";
  for (let x = 0; x < w; x += 12) {
    ctx.fillRect(x, h - 18, 1, x % 60 === 0 ? 8 : 4);
  }

  // Pulsera de plata, cadena de eslabones
  ctx.save();
  ctx.translate(w / 2, h * 0.45);
  ctx.rotate(-0.2);
  ctx.strokeStyle = "#d4d8e0";
  ctx.lineWidth = 6;
  ctx.beginPath();
  for (let i = -8; i <= 8; i++) {
    const x = i * 14;
    const y = Math.sin(i * 0.4) * 3;
    if (i === -8) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // Eslabones
  for (let i = -8; i <= 8; i++) {
    const x = i * 14;
    const y = Math.sin(i * 0.4) * 3;
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#c0c4cc";
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Plaquita
  ctx.fillStyle = "#e8ecf0";
  ctx.fillRect(-22, -5, 44, 18);
  ctx.strokeStyle = "#7a7e84";
  ctx.lineWidth = 1;
  ctx.strokeRect(-22, -5, 44, 18);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "italic bold 14px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("V.A.", 0, 5);
  ctx.restore();

  // Eslabón roto al lado
  ctx.save();
  ctx.translate(w * 0.78, h * 0.35);
  ctx.rotate(0.5);
  ctx.strokeStyle = "#a8aab0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 1.4);
  ctx.stroke();
  ctx.restore();

  evidenceTag(ctx, w * 0.15, h * 0.18, "3");
}

function drawPhone(ctx, w, h) {
  // Mesa
  ctx.fillStyle = "#2a2418";
  ctx.fillRect(0, 0, w, h);
  // Móvil
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(0.15);
  // Carcasa
  ctx.fillStyle = "#0a0a0a";
  roundRect(ctx, -55, -100, 110, 200, 14, true);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  roundRect(ctx, -55, -100, 110, 200, 14, false);
  // Pantalla
  ctx.fillStyle = "#1a2840";
  roundRect(ctx, -48, -88, 96, 178, 6, true);

  // Notch
  ctx.fillStyle = "#000";
  ctx.fillRect(-14, -90, 28, 6);

  // Mensaje borrado en pantalla
  ctx.fillStyle = "rgba(244,236,216,0.85)";
  ctx.font = "bold 9px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("MENSAJE BORRADO", 0, -55);
  ctx.fillStyle = "rgba(244,236,216,0.5)";
  ctx.font = "italic 8px Georgia";
  ctx.fillText('"Tengo pruebas,', 0, -38);
  ctx.fillText('esta noche se acaba"', 0, -26);

  ctx.fillStyle = "rgba(220,80,80,0.85)";
  ctx.font = "bold 8px Courier New";
  ctx.fillText("00:51", 0, -8);

  // Línea de tiempo
  ctx.fillStyle = "rgba(244,236,216,0.2)";
  ctx.fillRect(-40, 8, 80, 1);

  ctx.fillStyle = "rgba(244,236,216,0.7)";
  ctx.font = "8px Courier New";
  ctx.fillText("01:08", 0, 28);
  ctx.font = "7px Courier New";
  ctx.fillText("Llamada perdida", 0, 40);
  ctx.fillText("Núm. desconocido", 0, 50);

  ctx.restore();

  // Gotas de agua (estuvo en la piscina)
  ctx.fillStyle = "rgba(160,200,230,0.4)";
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * w,
      Math.random() * h,
      2 + Math.random() * 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  evidenceTag(ctx, w * 0.82, h * 0.84, "4");
}

function drawKeys(ctx, w, h) {
  // Pared de extintor
  ctx.fillStyle = "#9a3a2a";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#7a2a1a";
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  // Sombra del hueco
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(w * 0.15, h * 0.2, w * 0.7, h * 0.5);

  // Llaves
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.3);

  // Anilla
  ctx.strokeStyle = "#d4a754";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.stroke();

  // Llave 1
  ctx.fillStyle = "#c7a14b";
  ctx.beginPath();
  ctx.ellipse(-50, -15, 14, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-44, -18, 30, 6);
  ctx.fillRect(-22, -22, 4, 12);
  ctx.fillRect(-30, -22, 4, 10);

  // Llave 2 (más oscura, "duplicada")
  ctx.fillStyle = "#8a6a3a";
  ctx.beginPath();
  ctx.ellipse(40, 18, 14, 14, 0, 0.3, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(14, 14, 30, 6);
  ctx.fillRect(14, 8, 4, 12);
  ctx.fillRect(22, 8, 4, 10);

  ctx.restore();

  evidenceTag(ctx, w * 0.16, h * 0.16, "5");
}

function drawPaint(ctx, w, h) {
  // Suelo de almacén
  ctx.fillStyle = "#5a4a3a";
  ctx.fillRect(0, 0, w, h);
  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.78, w * 0.3, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bote
  ctx.save();
  ctx.translate(w / 2, h * 0.45);
  // Cuerpo
  ctx.fillStyle = "#3a3a3a";
  roundRect(ctx, -50, -10, 100, 120, 6, true);
  // Tapa medio abierta
  ctx.fillStyle = "#2a2a2a";
  ctx.beginPath();
  ctx.moveTo(-55, -10);
  ctx.lineTo(-60, -22);
  ctx.lineTo(55, -22);
  ctx.lineTo(50, -10);
  ctx.closePath();
  ctx.fill();
  // Asa
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -16, 35, Math.PI, 0);
  ctx.stroke();
  // Etiqueta
  ctx.fillStyle = "#f4ecd8";
  ctx.fillRect(-40, 10, 80, 60);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;
  ctx.strokeRect(-40, 10, 80, 60);
  ctx.fillStyle = "#2266aa";
  ctx.fillRect(-32, 18, 64, 16);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 9px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AZUL ARQ.", 0, 26);
  ctx.font = "7px Courier New";
  ctx.fillText("AC-2080", 0, 44);
  ctx.fillText("MANTENIM.", 0, 56);

  // Chorretón de pintura
  ctx.fillStyle = "#2266aa";
  ctx.beginPath();
  ctx.moveTo(-30, 95);
  ctx.bezierCurveTo(-60, 130, -80, 120, -90, 145);
  ctx.lineTo(-70, 150);
  ctx.bezierCurveTo(-60, 130, -40, 120, -10, 100);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  evidenceTag(ctx, w * 0.82, h * 0.18, "6");
}

function drawObject(ctx, w, h, ev) {
  ctx.fillStyle = "#2a2418";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#" + (ev.color || 0x888888).toString(16).padStart(6, "0");
  ctx.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.4);
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
  const r = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (color & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

// ----------------------------------------------------------------
// Partículas de polvo flotante en haz de luz
// ----------------------------------------------------------------
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
    const w = this.canvas.width;
    const h = this.canvas.height;
    // Mayoritariamente en el cono central
    const cx = w * this.lightX;
    const spread = w * 0.4;
    return {
      x: cx + (Math.random() - 0.5) * spread * 1.2,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.05 - Math.random() * 0.15,
      a: 0.2 + Math.random() * 0.55,
      drift: Math.random() * Math.PI * 2,
    };
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
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
      ctx.fillStyle = this.color.replace(/0?\.[0-9]+/, (p.a * glow).toFixed(2));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
