-- START v0.4 · evaluación v0.2 · borrador de migración
-- ESTADO: NO EJECUTAR. Requiere revisión y autorización independiente.
-- Este archivo contiene preguntas y opciones, pero NO claves correctas.
-- El primer bloque aborta deliberadamente cualquier ejecución accidental.

DO $guard$
BEGIN
  RAISE EXCEPTION 'BORRADOR START v0.4: migración bloqueada deliberadamente';
END
$guard$;

-- Diseño previsto para una futura migración controlada:
-- 1. Comprobar que existe el curso versionado slug=start-v0-4.
-- 2. Comprobar que existen sus lecciones position=1..8 y published=false.
-- 3. Crear assessments(slug=start-v0-4-evaluacion-v0-2, version=2, published=false).
-- 4. Insertar assessment_questions y assessment_options desde el payload siguiente.
-- 5. Insertar las claves únicamente en academy_private.assessment_answer_keys
--    mediante un canal protegido, nunca desde este repositorio público.
-- 6. Verificar conteos, unicidad, RLS, grants y función de corrección.
-- 7. Publicar solo después de pruebas autenticadas autorizadas.

-- Payload editorial congelado en el commit de esta rama:
-- [
  {
    "id": "START8-L01-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Qué describe mejor la inteligencia artificial?",
    "options": [
      {
        "key": "A",
        "text": "Una única aplicación concreta"
      },
      {
        "key": "B",
        "text": "Tecnologías que reconocen patrones, analizan, predicen o generan contenido"
      },
      {
        "key": "C",
        "text": "Un sistema que siempre dice la verdad"
      }
    ]
  },
  {
    "id": "START8-L01-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Qué diferencia básica hay entre un modelo y un asistente?",
    "options": [
      {
        "key": "A",
        "text": "El modelo ofrece capacidades y el asistente permite utilizarlas"
      },
      {
        "key": "B",
        "text": "El asistente siempre es más fiable que el modelo"
      },
      {
        "key": "C",
        "text": "No existe ninguna diferencia"
      }
    ]
  },
  {
    "id": "START8-L01-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "Si una IA responde con seguridad pero inventa una fecha, ¿qué debes hacer?",
    "options": [
      {
        "key": "A",
        "text": "Dar por buena la fecha"
      },
      {
        "key": "B",
        "text": "Comprobarla con una fuente vigente"
      },
      {
        "key": "C",
        "text": "Preguntar lo mismo otra vez al mismo asistente"
      }
    ]
  },
  {
    "id": "START8-L01-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "Si un documento no menciona el precio de una actividad, el precio es…",
    "options": [
      {
        "key": "A",
        "text": "Gratis"
      },
      {
        "key": "B",
        "text": "Pendiente de decisión"
      },
      {
        "key": "C",
        "text": "Desconocido"
      }
    ]
  },
  {
    "id": "START8-L01-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué uso es adecuado para empezar?",
    "options": [
      {
        "key": "A",
        "text": "Pedir un borrador y revisarlo"
      },
      {
        "key": "B",
        "text": "Delegar una decisión médica sin supervisión"
      },
      {
        "key": "C",
        "text": "Compartir datos privados innecesarios"
      }
    ]
  },
  {
    "id": "START8-L02-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Cuándo conviene continuar una conversación?",
    "options": [
      {
        "key": "A",
        "text": "Cuando seguimos con el mismo asunto"
      },
      {
        "key": "B",
        "text": "Siempre, aunque cambiemos de tema"
      },
      {
        "key": "C",
        "text": "Solo cuando hay archivos adjuntos"
      }
    ]
  },
  {
    "id": "START8-L02-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Cuándo ayuda abrir una conversación nueva?",
    "options": [
      {
        "key": "A",
        "text": "Al cambiar a un asunto independiente"
      },
      {
        "key": "B",
        "text": "Para borrar toda responsabilidad sobre el resultado"
      },
      {
        "key": "C",
        "text": "Cuando queremos evitar revisar el contexto"
      }
    ]
  },
  {
    "id": "START8-L02-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "¿Qué debes revisar antes de adjuntar un documento?",
    "options": [
      {
        "key": "A",
        "text": "Que puedes compartirlo y que no contiene datos innecesarios"
      },
      {
        "key": "B",
        "text": "Que tenga muchas páginas"
      },
      {
        "key": "C",
        "text": "Que el asistente lo publique"
      }
    ]
  },
  {
    "id": "START8-L02-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "¿Qué es el contexto de una conversación?",
    "options": [
      {
        "key": "A",
        "text": "La información previa que ayuda a interpretar la petición"
      },
      {
        "key": "B",
        "text": "La contraseña de la cuenta"
      },
      {
        "key": "C",
        "text": "Una garantía de memoria permanente"
      }
    ]
  },
  {
    "id": "START8-L02-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué diferencia hay entre dictado y conversación de voz?",
    "options": [
      {
        "key": "A",
        "text": "El dictado convierte voz en texto; la conversación permite intercambio hablado"
      },
      {
        "key": "B",
        "text": "Son siempre exactamente lo mismo"
      },
      {
        "key": "C",
        "text": "El dictado publica el audio"
      }
    ]
  },
  {
    "id": "START8-L03-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Qué es un prompt?",
    "options": [
      {
        "key": "A",
        "text": "Una petición o instrucción dirigida a la IA"
      },
      {
        "key": "B",
        "text": "Una contraseña"
      },
      {
        "key": "C",
        "text": "Una respuesta ya verificada"
      }
    ]
  },
  {
    "id": "START8-L03-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Qué suele mejorar una petición?",
    "options": [
      {
        "key": "A",
        "text": "Indicar tarea, contexto, formato y límites"
      },
      {
        "key": "B",
        "text": "Escribirla sin objetivo"
      },
      {
        "key": "C",
        "text": "Añadir datos privados aunque no hagan falta"
      }
    ]
  },
  {
    "id": "START8-L03-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "¿Qué límite ayuda a evitar invenciones?",
    "options": [
      {
        "key": "A",
        "text": "No inventes datos; señala lo que falte"
      },
      {
        "key": "B",
        "text": "Responde con mucha seguridad"
      },
      {
        "key": "C",
        "text": "Completa cualquier hueco"
      }
    ]
  },
  {
    "id": "START8-L03-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "Si el resultado no sirve, ¿qué paso es útil?",
    "options": [
      {
        "key": "A",
        "text": "Pedir una mejora concreta y revisar el nuevo resultado"
      },
      {
        "key": "B",
        "text": "Aceptar el primer borrador"
      },
      {
        "key": "C",
        "text": "Borrar la conversación sin analizarla"
      }
    ]
  },
  {
    "id": "START8-L03-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué debe hacer una instrucción clara?",
    "options": [
      {
        "key": "A",
        "text": "Explicar qué se necesita y para quién"
      },
      {
        "key": "B",
        "text": "Dejar todas las decisiones abiertas"
      },
      {
        "key": "C",
        "text": "Exigir que la IA actúe fuera de la conversación"
      }
    ]
  },
  {
    "id": "START8-L04-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Cuál es un proceso responsable para mejorar una respuesta?",
    "options": [
      {
        "key": "A",
        "text": "Revisar el borrador, pedir una mejora y comprobar el resultado"
      },
      {
        "key": "B",
        "text": "Copiar la primera respuesta sin leerla"
      },
      {
        "key": "C",
        "text": "Pedir muchas versiones y elegir la más larga"
      }
    ]
  },
  {
    "id": "START8-L04-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Qué debes comprobar después de pedir una mejora?",
    "options": [
      {
        "key": "A",
        "text": "Que mantiene los datos y condiciones correctos"
      },
      {
        "key": "B",
        "text": "Solo que suena más elegante"
      },
      {
        "key": "C",
        "text": "Que contiene más palabras"
      }
    ]
  },
  {
    "id": "START8-L04-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "Si una mejora introduce un precio no confirmado, ¿qué haces?",
    "options": [
      {
        "key": "A",
        "text": "Lo conservas porque la redacción es mejor"
      },
      {
        "key": "B",
        "text": "Lo eliminas o lo marcas como no confirmado"
      },
      {
        "key": "C",
        "text": "Lo presentas como una decisión pendiente"
      }
    ]
  },
  {
    "id": "START8-L04-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "¿Qué significa elegir la versión útil?",
    "options": [
      {
        "key": "A",
        "text": "Conservar la que cumple el objetivo y ha sido revisada"
      },
      {
        "key": "B",
        "text": "Elegir siempre la última"
      },
      {
        "key": "C",
        "text": "Elegir la que parece más convincente"
      }
    ]
  },
  {
    "id": "START8-L04-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué no sustituye a la comprobación?",
    "options": [
      {
        "key": "A",
        "text": "Volver a preguntar lo mismo al asistente"
      },
      {
        "key": "B",
        "text": "Consultar una fuente aplicable"
      },
      {
        "key": "C",
        "text": "Revisar los datos conocidos"
      }
    ]
  },
  {
    "id": "START8-L05-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Qué es una alucinación de IA?",
    "options": [
      {
        "key": "A",
        "text": "Información incorrecta o inventada que puede parecer convincente"
      },
      {
        "key": "B",
        "text": "Una imagen borrosa"
      },
      {
        "key": "C",
        "text": "Una respuesta demasiado corta"
      }
    ]
  },
  {
    "id": "START8-L05-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Cómo se verifica una fecha actual?",
    "options": [
      {
        "key": "A",
        "text": "Comparándola con una fuente oficial vigente"
      },
      {
        "key": "B",
        "text": "Preguntando varias veces al mismo asistente"
      },
      {
        "key": "C",
        "text": "Aceptando la fecha más reciente que aparezca"
      }
    ]
  },
  {
    "id": "START8-L05-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "Una respuesta con buen formato es necesariamente correcta.",
    "options": [
      {
        "key": "A",
        "text": "Sí"
      },
      {
        "key": "B",
        "text": "No"
      },
      {
        "key": "C",
        "text": "Solo si es larga"
      }
    ]
  },
  {
    "id": "START8-L05-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "¿Qué dato debe tratarse como desconocido?",
    "options": [
      {
        "key": "A",
        "text": "Uno que la fuente consultada no aporta"
      },
      {
        "key": "B",
        "text": "Uno que aparece en un programa oficial"
      },
      {
        "key": "C",
        "text": "Uno aprobado por el responsable"
      }
    ]
  },
  {
    "id": "START8-L05-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué conviene hacer con una afirmación importante que no puedes contrastar?",
    "options": [
      {
        "key": "A",
        "text": "Omitirla o marcarla como no confirmada"
      },
      {
        "key": "B",
        "text": "Convertirla en un hecho"
      },
      {
        "key": "C",
        "text": "Rellenarla con una suposición"
      }
    ]
  },
  {
    "id": "START8-L06-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Qué principio ayuda a proteger la privacidad?",
    "options": [
      {
        "key": "A",
        "text": "Compartir solo la información necesaria"
      },
      {
        "key": "B",
        "text": "Copiar todos los datos disponibles"
      },
      {
        "key": "C",
        "text": "Usar datos reales para cualquier prueba"
      }
    ]
  },
  {
    "id": "START8-L06-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "Antes de compartir una conversación, debes…",
    "options": [
      {
        "key": "A",
        "text": "Revisar nombres, direcciones, teléfonos y datos de terceros"
      },
      {
        "key": "B",
        "text": "Compartirla directamente"
      },
      {
        "key": "C",
        "text": "Suponer que el enlace es privado"
      }
    ]
  },
  {
    "id": "START8-L06-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "¿Qué debes hacer con una contraseña?",
    "options": [
      {
        "key": "A",
        "text": "No introducirla en una conversación ni documento general"
      },
      {
        "key": "B",
        "text": "Compartirla si la IA la pide"
      },
      {
        "key": "C",
        "text": "Guardarla en una captura pública"
      }
    ]
  },
  {
    "id": "START8-L06-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "¿Qué riesgo existe al adjuntar un documento?",
    "options": [
      {
        "key": "A",
        "text": "Puede contener información privada que no necesitas compartir"
      },
      {
        "key": "B",
        "text": "Siempre se borra automáticamente"
      },
      {
        "key": "C",
        "text": "La IA lo convierte en fuente oficial"
      }
    ]
  },
  {
    "id": "START8-L06-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué decisión debe seguir bajo control humano?",
    "options": [
      {
        "key": "A",
        "text": "Las decisiones importantes y la revisión del resultado"
      },
      {
        "key": "B",
        "text": "El formato de una lista sencilla"
      },
      {
        "key": "C",
        "text": "La corrección ortográfica solamente"
      }
    ]
  },
  {
    "id": "START8-L07-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Qué tarea cotidiana es adecuada para empezar?",
    "options": [
      {
        "key": "A",
        "text": "Preparar un borrador de mensaje sin datos sensibles"
      },
      {
        "key": "B",
        "text": "Autorizar un pago automáticamente"
      },
      {
        "key": "C",
        "text": "Decidir una medicación"
      }
    ]
  },
  {
    "id": "START8-L07-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Qué debe incluir una petición para organizar tareas?",
    "options": [
      {
        "key": "A",
        "text": "La tarea, el contexto, el formato y los límites necesarios"
      },
      {
        "key": "B",
        "text": "Contraseñas y datos de terceros"
      },
      {
        "key": "C",
        "text": "Una orden sin objetivo"
      }
    ]
  },
  {
    "id": "START8-L07-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "Una propuesta de la IA equivale a una acción realizada.",
    "options": [
      {
        "key": "A",
        "text": "Sí"
      },
      {
        "key": "B",
        "text": "No"
      },
      {
        "key": "C",
        "text": "Solo en una tabla"
      }
    ]
  },
  {
    "id": "START8-L07-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "¿Qué conviene comprobar en una recomendación?",
    "options": [
      {
        "key": "A",
        "text": "Su utilidad, vigencia y adecuación a la situación"
      },
      {
        "key": "B",
        "text": "Solo su diseño"
      },
      {
        "key": "C",
        "text": "Que tenga cinco opciones"
      }
    ]
  },
  {
    "id": "START8-L07-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Cuándo no conviene delegar automáticamente?",
    "options": [
      {
        "key": "A",
        "text": "En decisiones de salud, dinero, obligaciones legales o seguridad"
      },
      {
        "key": "B",
        "text": "En una lista de ideas"
      },
      {
        "key": "C",
        "text": "En un borrador revisable"
      }
    ]
  },
  {
    "id": "START8-L08-Q01",
    "lesson": 0,
    "position": 1,
    "prompt": "¿Cuál es el flujo básico del proyecto?",
    "options": [
      {
        "key": "A",
        "text": "Definir, preparar, pedir, revisar, corregir y entregar"
      },
      {
        "key": "B",
        "text": "Pedir, publicar y olvidar"
      },
      {
        "key": "C",
        "text": "Copiar, compartir y reservar"
      }
    ]
  },
  {
    "id": "START8-L08-Q02",
    "lesson": 0,
    "position": 2,
    "prompt": "¿Qué diferencia hay entre dato confirmado y desconocido?",
    "options": [
      {
        "key": "A",
        "text": "El confirmado aparece en una fuente aplicable; el desconocido no está aportado"
      },
      {
        "key": "B",
        "text": "El desconocido siempre está pendiente"
      },
      {
        "key": "C",
        "text": "Son exactamente lo mismo"
      }
    ]
  },
  {
    "id": "START8-L08-Q03",
    "lesson": 0,
    "position": 3,
    "prompt": "¿Qué debe contener un prompt de proyecto?",
    "options": [
      {
        "key": "A",
        "text": "Tarea, contexto, destinatario, formato y límites"
      },
      {
        "key": "B",
        "text": "Solo una palabra"
      },
      {
        "key": "C",
        "text": "Datos inventados para completar el texto"
      }
    ]
  },
  {
    "id": "START8-L08-Q04",
    "lesson": 0,
    "position": 4,
    "prompt": "¿Qué debes hacer con el primer borrador?",
    "options": [
      {
        "key": "A",
        "text": "Revisarlo y pedir mejoras concretas"
      },
      {
        "key": "B",
        "text": "Publicarlo inmediatamente"
      },
      {
        "key": "C",
        "text": "Tratarlo como información oficial"
      }
    ]
  },
  {
    "id": "START8-L08-Q05",
    "lesson": 0,
    "position": 5,
    "prompt": "¿Qué evalúa el proyecto además del aspecto visual?",
    "options": [
      {
        "key": "A",
        "text": "El proceso de revisión y la verificación de datos"
      },
      {
        "key": "B",
        "text": "El número de páginas únicamente"
      },
      {
        "key": "C",
        "text": "La cantidad de herramientas usadas"
      }
    ]
  }
]

-- SQL orientativo (no ejecutable mientras exista el guard anterior):
-- BEGIN;
-- INSERT INTO public.assessments
--   (course_id,slug,title,version,pass_percent,published)
-- SELECT c.id,'start-v0-4-evaluacion-v0-2',
--   'Evaluación START v0.4',2,80,false
-- FROM public.courses c
-- WHERE c.slug='start-v0-4'
-- RETURNING id;
--
-- Para cada elemento del payload:
--   localizar lesson_id por course_id + position;
--   insertar source_id, source_version, assessment_id, lesson_id,
--   position, question_type='single_choice', prompt, points=1;
--   insertar sus opciones A/B/C;
--   insertar la respuesta correcta solo en academy_private.
--
-- COMPROBACIONES OBLIGATORIAS:
-- SELECT count(*) FROM public.assessment_questions
--   WHERE source_version='START v0.2 candidate'; -- esperado: 40
-- SELECT count(*) FROM public.assessment_options o
--   JOIN public.assessment_questions q ON q.id=o.question_id
--   WHERE q.source_version='START v0.2 candidate'; -- esperado: 120
-- RLS y grants deben revisarse antes de cualquier published=true.
