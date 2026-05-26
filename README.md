# Criminal Files

Un juego web 2D donde te metes en la piel de un criminólogo / agente de la unidad de investigación. Está construido como un **"Mind Place"** al estilo *Alan Wake 2*: tu tablero del caso lleno de polaroids con chinchetas, post-its escritos a mano, hilo rojo conectando pistas, una lámpara cenital parpadeante y un viejo monitor CRT para revisar las grabaciones.

Tecnología: HTML5 + CSS3 + Canvas 2D + SVG + Web Audio API. Sin servidor, sin frameworks y sin assets externos — toda la ilustración y el sonido se generan al vuelo en el navegador.

## El caso #0001 — "El misterio de Splash Park"

> 06:47 AM. Un cuerpo flotando boca abajo en la piscina de toboganes. Parece un accidente, pero la forense ha detectado un golpe occipital. La hora de la muerte no cuadra con el horario del parque.

Tu trabajo: recoger pistas del muro, interrogar a cuatro sospechosos, revisar las cámaras CCTV, tirar hilos rojos entre lo que conecta, y firmar la acusación correcta.

## Mecánicas

- **El muro del caso** — corkboard 2D con suspectos en polaroid (4) y pruebas en polaroid (6), todas pinchadas con chinchetas de colores. Lámpara que parpadea, polvo flotando, papeles oscilando suavemente.
- **Pruebas físicas** — clic en cualquier polaroid → modal de examen con ilustración grande, descripción forense y opción de añadirla al expediente.
- **Interrogatorios** — clic en un sospechoso → ficha con su foto polaroid + árbol de preguntas con desbloqueos. Cada pregunta nueva añade revelaciones al diario.
- **CCTV CRT** — un monitor con scanlines y estática reproduce las 6 cámaras de seguridad. Una de ellas fue borrada manualmente.
- **Hilo rojo** — activa el modo *Conectar* y enlaza dos pistas con un hilo rojo SVG en el muro.
- **Diario del detective** — pestañas para pistas, sospechosos, cronología reconstruida automáticamente, y todas tus notas.
- **Veredicto** — combina sospechoso + móvil + prueba clave en la zona de acusación y firma el atestado.

## Modos y dificultad

- **Modo Historia** (disponible): casos guiados. Empieza con la piscina.
- **Investigación Libre** y **Contrarreloj**: hueco para futuros casos.
- Dificultades:
  - **Cadete**: solo necesitas identificar al culpable.
  - **Detective**: culpable + móvil.
  - **FBI**: culpable + móvil + prueba clave.

## Controles

| Acción | Cómo |
| --- | --- |
| Examinar pista / interrogar sospechoso | Clic izquierdo sobre la polaroid |
| Activar modo "tirar hilo" | Botón **Conectar** en la barra inferior |
| Abrir diario | Botón **Diario** o tecla `Tab` |
| Revisar cámaras | Clic en el monitor CRT |
| Cerrar paneles | `Esc` |
| Silenciar | `M` o icono altavoz |

## Cómo arrancar localmente

```bash
npm start   # sirve la carpeta en http://localhost:5173
```

No hay paso de build: es estático, listo para desplegar en GitHub Pages, Netlify, Vercel, Cloudflare Pages…

## Arquitectura

```
.
├── index.html          # entry + pantallas (menú, briefing, muro, modales, result)
├── styles.css          # tema noir/corkboard
└── src/
    ├── main.js         # orquestación, estado, render de polaroids, hilo rojo
    ├── art.js          # canvas procedural: retratos, evidencias, polvo
    ├── audio.js        # síntesis procedural (ambiente, efectos, tensión)
    └── cases/
        └── case1.js    # narrativa, sospechosos, pistas, cámaras, solución
```

Para añadir un nuevo caso, crea otro archivo en `src/cases/` siguiendo la forma de `case1.js` y enlázalo desde `main.js`.

## Créditos

Diseño y desarrollo: Iker + Devin.
Sin assets externos: Canvas 2D + SVG + Web Audio API.
