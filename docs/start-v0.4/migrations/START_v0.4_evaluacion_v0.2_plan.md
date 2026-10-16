# START v0.4 · plan de migración de evaluación v0.2

**Estado:** BORRADOR TÉCNICO · NO EJECUTAR  
**Rama:** `feat/start-v0-4-8-lecciones-candidato`  
**Fecha:** 16/10/2026

Este documento prepara la futura migración de la evaluación candidata. No modifica Supabase, no publica contenidos y no habilita el cuestionario para alumnos.

## Decisión de versionado

La ruta histórica `start` conserva sus cuatro lecciones. La nueva edición se debe introducir como una entidad versionada separada:

- Curso candidato: `start-v0-4`
- Evaluación candidata: `start-v0-4-evaluacion-v0-2`
- Versión de evaluación: `2`
- Publicación inicial: `false`
- Umbral provisional revisado en preview: 80 %

No se debe reutilizar el slug histórico `start-evaluacion-v1` ni actualizar sus preguntas.

## Correspondencia prevista

| Lección | Título | Preguntas | Fuente |
|---|---|---:|---|
| L01 | Descubre qué es la IA | 5 | L01.md |
| L02 | Tu primer asistente de IA | 5 | L02.md |
| L03 | Aprende a hablar con la IA: los prompts | 5 | L03.md |
| L04 | Cómo mejorar y aprovechar las respuestas | 5 | L04.md |
| L05 | Errores, información falsa y verificación | 5 | L05.md |
| L06 | Privacidad, seguridad y uso responsable | 5 | L06.md |
| L07 | La IA en tu vida cotidiana | 5 | L07.md |
| L08 | Tu primer proyecto completo con inteligencia artificial | 5 | L08.md |

Total: **8 lecciones y 40 preguntas**. Cada pregunta tiene tres opciones y una única respuesta correcta.

## Tablas existentes verificadas

La inspección de Supabase confirmó estas estructuras relevantes:

- `courses`: curso, slug único y estado de publicación.
- `lessons`: contenido JSONB, posición, slug y publicación.
- `assessments`: evaluación vinculada al curso, versión, umbral y publicación.
- `assessment_questions`: identificador editorial único, versión de fuente, lección y posición.
- `assessment_options`: opciones A/B/C.
- `academy_private.assessment_answer_keys`: claves correctas fuera del esquema público.
- `assessment_attempts` y `assessment_answers`: persistencia de intentos y respuestas.

Todas estas tablas aparecen con RLS activo en la inspección actual.

## Identificadores editoriales

START8-L01-Q01, START8-L01-Q02, START8-L01-Q03, START8-L01-Q04, START8-L01-Q05, START8-L02-Q01, START8-L02-Q02, START8-L02-Q03, START8-L02-Q04, START8-L02-Q05, START8-L03-Q01, START8-L03-Q02, START8-L03-Q03, START8-L03-Q04, START8-L03-Q05, START8-L04-Q01, START8-L04-Q02, START8-L04-Q03, START8-L04-Q04, START8-L04-Q05, START8-L05-Q01, START8-L05-Q02, START8-L05-Q03, START8-L05-Q04, START8-L05-Q05, START8-L06-Q01, START8-L06-Q02, START8-L06-Q03, START8-L06-Q04, START8-L06-Q05, START8-L07-Q01, START8-L07-Q02, START8-L07-Q03, START8-L07-Q04, START8-L07-Q05, START8-L08-Q01, START8-L08-Q02, START8-L08-Q03, START8-L08-Q04, START8-L08-Q05

## Orden seguro de la futura migración

1. Crear el curso `start-v0-4` con `published=false`.
2. Crear sus ocho lecciones con contenido aprobado para integración, pero `published=false`.
3. Crear la evaluación v0.2 vinculada al nuevo curso, también `published=false`.
4. Insertar las 40 preguntas con `source_version='START v0.2 candidate'`.
5. Insertar 120 opciones A/B/C.
6. Insertar las claves correctas únicamente en `academy_private.assessment_answer_keys`.
7. Verificar unicidad de `source_id`, posiciones 1–5 por lección y tres opciones por pregunta.
8. Revisar RLS, grants del Data API y la función de corrección antes de activar nada.
9. Ejecutar una prueba autenticada con una cuenta de prueba autorizada.
10. Publicar solo después de una autorización independiente.

## Límites de esta propuesta

- No contiene claves de respuestas.
- No contiene credenciales ni tokens.
- No se ha aplicado ninguna migración.
- No se ha creado una rama Supabase de pago.
- No se ha cambiado `assessment.js`, `evaluacion.html` ni la evaluación histórica.
- La evaluación de preview es local y no guarda resultados.

## Bloqueadores antes de ejecutar

- Confirmar si el curso versionado `start-v0-4` es la decisión final frente a ampliar el curso histórico.
- Revisar editorialmente las 40 preguntas, aunque el banco haya sido aprobado para esta fase candidata.
- Preparar las claves en un canal protegido.
- Revisar políticas RLS y permisos efectivos con un JWT de alumno de prueba.
- Confirmar la estrategia de publicación de las ocho lecciones.

