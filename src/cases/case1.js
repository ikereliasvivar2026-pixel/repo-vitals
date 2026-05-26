// Caso #0001 — "El misterio de Splash Park"
// Víctima encontrada flotando en la piscina de toboganes con un golpe en la cabeza.

export const case1 = {
  id: "case-001-pool",
  title: "El misterio de Splash Park",
  subtitle: "Splash Park · Piscina principal",
  briefing: `06:47 AM. Aviso al 112: el personal del parque acuático Splash Park ha encontrado un cuerpo flotando boca abajo en la piscina de toboganes.

VÍCTIMA: Lucía Vargas, 19 años, taquillera del propio parque desde hace 4 meses.

Apariencia: ahogamiento accidental. La forense de guardia ya ha notado algo que no encaja: un golpe contundente en la zona occipital del cráneo, edema, y signos de muerte estimados entre la 01:00 y las 03:00 de la madrugada — cuando el parque está cerrado.

Tu equipo te despliega como agente al cargo. La escena está acordonada, hay cuatro personas con acceso al recinto esa noche. Recoge pistas, interroga, revisa las cámaras y firma una acusación formal.`,

  scene: {
    title: "Piscina de toboganes",
    sub: "Splash Park · 07:14 AM",
  },

  // Sospechosos
  suspects: [
    {
      id: "marcos",
      name: "Marcos Tena",
      role: "Socorrista jefe",
      initial: "M",
      brief:
        "Tenía un juego de llaves del recinto. Lucía rechazó sus avances hace dos semanas.",
      x: 11,
      z: 4,
      color: 0xb84b3a,
      portrait: "M",
      opening:
        "Yo cerré ayer a las 23:00. Lucía ya se había ido. No sé qué hacía aquí de noche, agente, se lo juro.",
      questions: [
        {
          id: "keys",
          q: "¿Quién más tiene llaves del recinto?",
          a: "Solo yo y el encargado nocturno, Víctor. Bueno… y la gerencia, pero nadie viene de noche.",
          reveals: ["keys-shared"],
        },
        {
          id: "lucia",
          q: "¿Cómo era tu relación con Lucía?",
          a: "Compañeros, nada más. Vale, le pregunté una vez si quería tomar algo. Dijo que no. Punto.",
          reveals: ["marcos-motive"],
        },
        {
          id: "alibi",
          q: "¿Dónde estuviste anoche entre la 1 y las 3?",
          a: "En casa, durmiendo. Mi pareja lo confirmará. Si quiere mire la cámara del parking, mi coche no se movió.",
          reveals: ["marcos-alibi"],
        },
        {
          id: "victor",
          q: "Háblame de Víctor.",
          a: "Tiene… historial. No me cae bien. Lucía discutió con él hace una semana, dijo que lo había pillado en las taquillas.",
          reveals: ["victor-history", "lockers-theft"],
          requires: ["lucia"],
        },
      ],
    },
    {
      id: "daniel",
      name: "Daniel Ríos",
      role: "Ex‑pareja de la víctima",
      initial: "D",
      brief:
        "Discutió en público con Lucía hace dos días. Asegura que se reconciliaron por teléfono.",
      x: -11,
      z: 6,
      color: 0x4a7fb8,
      portrait: "D",
      opening:
        "No me lo puedo creer. Habíamos quedado… mañana. Íbamos a hablar. ¿Quién haría algo así?",
      questions: [
        {
          id: "fight",
          q: "Os vieron discutir el martes en el centro comercial.",
          a: "Sí, fue una tontería. Yo estaba celoso de un compañero suyo, ella se ofendió. Hablamos esa misma noche y me disculpé.",
          reveals: ["daniel-fight"],
        },
        {
          id: "alibi",
          q: "¿Dónde estabas anoche?",
          a: "En Valencia, en un curso de empresa. Llegué a casa esta mañana. Tengo el ticket de la gasolinera de las 02:14, autopista A-3.",
          reveals: ["daniel-alibi"],
        },
        {
          id: "sara",
          q: "Sara Molina, la amiga de Lucía.",
          a: "Buena chica. Siempre estaba con Lucía. Creo… creo que le gustaba yo, pero nunca pasó nada.",
          reveals: ["sara-feelings"],
        },
      ],
    },
    {
      id: "sara",
      name: "Sara Molina",
      role: "Mejor amiga de la víctima",
      initial: "S",
      brief: "Reportó la desaparición esta mañana. Está visiblemente afectada.",
      x: 11,
      z: -8,
      color: 0xc6739e,
      portrait: "S",
      opening:
        "Lucía me mandó un mensaje raro anoche y me lo borró. Decía algo de 'esta noche se acaba'. ¿Pero qué pasaba?",
      questions: [
        {
          id: "message",
          q: "El mensaje. Cuéntame exactamente qué decía.",
          a: "Lo leí de refilón: 'Tengo pruebas, esta noche se acaba'. Lo intenté llamar, pero no contestó. Pensé que era cosa de Dani.",
          reveals: ["lucia-message"],
        },
        {
          id: "daniel",
          q: "¿Y tú con Daniel… qué tal?",
          a: "Por favor. Es el novio de mi mejor amiga. Era. Yo nunca…",
          reveals: ["sara-feelings"],
        },
        {
          id: "victor",
          q: "¿Sabes algo de Víctor, el encargado nocturno?",
          a: "Lucía no soportaba estar a solas con él. Decía que lo había visto rebuscando en las taquillas del personal hace una semana.",
          reveals: ["lockers-theft", "victor-history"],
        },
      ],
    },
    {
      id: "victor",
      name: "Víctor Aguilar",
      role: "Encargado nocturno",
      initial: "V",
      brief:
        "Antecedentes por robos menores. Discutió con la víctima hace una semana.",
      x: -11,
      z: -6,
      color: 0x6b8e4f,
      portrait: "V",
      opening:
        "Anoche hice mi turno como siempre. No vi nada. Si la chica entró, yo no la oí. Soy mantenimiento, no socorrista.",
      questions: [
        {
          id: "shift",
          q: "Tu turno: hora de entrada y salida exactas.",
          a: "Entré a las 23:30 y salí a las 06:00. Estuve fregando filtros y revisando bombas. No salgo de la sala de máquinas.",
          reveals: ["victor-shift"],
        },
        {
          id: "lockers",
          q: "Hay testigos de que rebuscaste en las taquillas del personal.",
          a: "¡Mentira! Las estaba revisando, había una avería en la cerradura. Esa chica… Lucía… era una mentirosa.",
          reveals: ["victor-temper", "lockers-theft"],
        },
        {
          id: "bracelet",
          q: "Llevas una marca en la muñeca. ¿Y tu pulsera?",
          a: "¿Pulsera? Hace tiempo que no la… debí dejármela en casa. ¿Por qué le interesa?",
          reveals: ["victor-bracelet"],
          requires: [],
        },
        {
          id: "record",
          q: "Has sido condenado dos veces por robo.",
          a: "Hace años. Pagué mi deuda. No voy a matar a nadie por una taquilla, agente.",
          reveals: ["victor-history"],
        },
      ],
    },
  ],

  // Evidencias en la escena (3D)
  evidence: [
    {
      id: "body",
      name: "Cuerpo de Lucía Vargas",
      x: 0,
      z: 4,
      y: 0,
      color: 0xf2e6cf,
      type: "body",
      look:
        "Cuerpo de mujer joven, boca abajo en el agua. La forense confirma un golpe occipital con instrumento contundente y restos de pintura azul en el cabello.",
      reveals: ["body-blunt-force", "body-blue-paint"],
    },
    {
      id: "blood-stairs",
      name: "Mancha de sangre en escalera del tobogán",
      x: 6.5,
      z: -11,
      y: 0.05,
      color: 0x991111,
      type: "blood",
      look:
        "Salpicaduras de sangre en el segundo tramo de la escalera del tobogán principal, a 6 m de altura. Compatible con el golpe occipital de la víctima.",
      reveals: ["pool-attack-location"],
    },
    {
      id: "bracelet",
      name: "Pulsera de plata con iniciales 'VA'",
      x: 7.2,
      z: -11.5,
      y: 0.3,
      color: 0xdddddd,
      type: "object",
      look:
        "Pulsera de plata barata, eslabón roto, grabada con 'V. A.'. Encontrada en el escalón superior del tobogán, junto a la mancha de sangre.",
      reveals: ["bracelet-VA"],
    },
    {
      id: "phone",
      name: "Móvil de la víctima",
      x: -2,
      z: 9,
      y: 0.2,
      color: 0x2a2a2a,
      type: "object",
      look:
        "Móvil empapado, aún funciona. Última actividad: 00:51, un mensaje borrado a Sara: 'Tengo pruebas, esta noche se acaba'. Llamada perdida desde número desconocido a las 01:08.",
      reveals: ["lucia-message", "lucia-call"],
    },
    {
      id: "keys",
      name: "Llaves del recinto (duplicado)",
      x: -6,
      z: 11,
      y: 0.3,
      color: 0xc7a14b,
      type: "object",
      look:
        "Un juego de llaves escondido en el hueco de un extintor, junto a la sala de máquinas. Marcos asegura que solo había dos juegos: el suyo y el de Víctor.",
      reveals: ["keys-shared"],
    },
    {
      id: "paint",
      name: "Bote de pintura azul abierto",
      x: -14,
      z: 1,
      y: 0.5,
      color: 0x2266aa,
      type: "object",
      look:
        "Bote de pintura azul a medio cerrar en el almacén de mantenimiento. La pintura coincide con los restos en el cabello de la víctima. Huellas dactilares parciales.",
      reveals: ["paint-match"],
    },
  ],

  // Cámaras de seguridad
  cameras: [
    {
      id: "cam1",
      label: "CAM 01 — Acceso principal",
      timestamp: "00:00 — 06:00",
      footage:
        "Sin movimiento. Cierre normal a las 23:02. Marcos Tena marcha en su coche a las 23:11. No se vuelve a abrir la puerta principal en toda la noche.",
      hint: "Quien entró, no usó la puerta principal.",
      reveals: ["cam1-noentry"],
    },
    {
      id: "cam2",
      label: "CAM 02 — Piscina principal",
      timestamp: "00:00 — 03:00",
      footage:
        "Imagen oscura, lente parcialmente cubierta (manchas húmedas). A las 01:42 se ve una silueta en lo alto del tobogán durante 3 segundos. Demasiado borroso para identificar.",
      hint: "Algo a las 01:42 en lo alto del tobogán. La hora coincide.",
      reveals: ["cam2-shadow"],
    },
    {
      id: "cam3",
      label: "CAM 03 — Vestuarios",
      timestamp: "01:30 — 02:15",
      footage: null,
      broken: true,
      hint:
        "GRABACIÓN BORRADA. La cámara fue apagada manualmente desde el panel interno entre la 01:30 y las 02:15. Solo alguien con acceso a la sala técnica pudo hacerlo.",
      reveals: ["cam3-deleted", "internal-access"],
    },
    {
      id: "cam4",
      label: "CAM 04 — Almacén mantenimiento",
      timestamp: "00:00 — 06:00",
      footage:
        "Víctor Aguilar entra al almacén a las 00:48 y sale a las 01:23 con un objeto largo en la mano (¿una llave inglesa?). No vuelve a entrar.",
      hint: "Víctor se ausenta entre 01:23 y 03:40. No está en su sala de máquinas como dijo.",
      reveals: ["victor-absent", "victor-tool"],
    },
    {
      id: "cam5",
      label: "CAM 05 — Parking trasero",
      timestamp: "00:00 — 03:00",
      footage:
        "El coche de Víctor está aparcado toda la noche. El de Marcos no aparece. NO se ve ningún otro vehículo. Daniel Ríos no podría haber entrado en coche.",
      hint: "Marcos no estuvo. Daniel tampoco. Víctor SÍ estuvo.",
      reveals: ["cam5-vehicles"],
    },
    {
      id: "cam6",
      label: "CAM 06 — Sala de máquinas",
      timestamp: "01:00 — 03:00",
      footage:
        "Sala vacía la mayor parte de la noche. Víctor entra brevemente a las 03:38 — empapado, jadeando — y cambia de ropa. Mete algo en una bolsa negra.",
      hint: "Víctor vuelve mojado y se cambia justo a la hora estimada de muerte.",
      reveals: ["victor-wet", "evidence-bag"],
    },
  ],

  // Opciones de móvil
  motives: [
    {
      id: "rejection",
      label: "Rechazo amoroso",
      desc: "Marcos no soportó que Lucía lo rechazara y la atacó.",
    },
    {
      id: "jealousy",
      label: "Celos / despecho",
      desc: "Daniel no aceptó la ruptura y la mató por celos.",
    },
    {
      id: "love-triangle",
      label: "Triángulo amoroso",
      desc: "Sara mató a Lucía para quedarse con Daniel.",
    },
    {
      id: "silence-witness",
      label: "Silenciar a una testigo",
      desc:
        "Víctor mató a Lucía para impedir que denunciara sus robos en taquillas.",
    },
    {
      id: "robbery",
      label: "Atraco fallido",
      desc: "Asaltante externo que aprovechó la noche.",
    },
  ],

  // Opciones de prueba clave (entre las que recoge el jugador)
  // Se filtran a las pistas REALMENTE recogidas al mostrar
  keyEvidenceOptions: [
    "body",
    "blood-stairs",
    "bracelet",
    "phone",
    "keys",
    "paint",
  ],

  // SOLUCIÓN CORRECTA
  solution: {
    suspect: "victor",
    motive: "silence-witness",
    evidence: "bracelet", // la pulsera VA en la escalera del tobogán
  },

  // Resoluciones por dificultad: cuántos aciertos necesitas
  // (Cadete: solo culpable; Detective: culpable+móvil; FBI: los tres)
  pointsByDifficulty: {
    cadet: ["suspect"],
    detective: ["suspect", "motive"],
    fbi: ["suspect", "motive", "evidence"],
  },

  // Texto final
  resolution: {
    success: `Caso resuelto. Víctor Aguilar — encargado nocturno con dos condenas previas por hurto — fue identificado como autor del homicidio de Lucía Vargas.

A las 00:48 entró al almacén de mantenimiento, salió a las 01:23 con un objeto contundente y se dirigió a la zona de toboganes. Lucía había acudido al parque con pruebas — fotografías que Víctor robaba de las taquillas del personal — para confrontarlo. Discutieron en lo alto de la escalera del tobogán principal. Víctor la golpeó por detrás. La pulsera con sus iniciales se rompió en el forcejeo. Empujó el cuerpo por el tobogán para simular un accidente.

Borró la cámara 3 desde el panel interno (al que solo él tenía acceso). Olvidó la cámara 5 del parking. La pintura azul del bote del almacén, los restos en el cabello de la víctima, y la grabación de la cámara 6 lo confirman.`,

    partial: `Has identificado al culpable, pero el atestado tiene huecos. El fiscal pedirá más pruebas para sostener la acusación. Caso resuelto con reservas.`,

    failure: `Acusación incorrecta. El verdadero homicida — Víctor Aguilar — sigue libre. Lucía Vargas no obtendrá justicia esta vez.

Pista que se te escapó: la pulsera con iniciales 'V. A.' encontrada junto a la mancha de sangre en lo alto del tobogán, y la cámara 6 mostrando a Víctor volviendo empapado a las 03:38, son las pruebas que cierran el círculo. Lucía iba a denunciar los robos de Víctor en las taquillas: esa era su motivación para silenciarla.`,
  },
};
