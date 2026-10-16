# START v0.4 · mapa candidato de evaluación v2

Estado: CANDIDATO · NO IMPORTAR · NO PUBLICAR

## Diseño

- Evaluación: start-evaluacion-v2
- Versión: 2
- Preguntas: 40
- Opciones: 120, tres por pregunta
- Distribución: cinco preguntas por cada una de las ocho lecciones
- Aprobado previsto: 70%
- Claves y justificaciones: únicamente en academy_private
- Evaluación histórica: start-evaluacion-v1 permanece intacta

## Relación editorial

| Lección | Preguntas |
|---|---|
| L01 · Descubre qué es la IA | START8-L01-Q01, Q02, Q03, Q04, Q05 |
| L02 · Tu primer asistente de IA | START8-L02-Q01, Q02, Q03, Q04, Q05 |
| L03 · Aprende a hablar con la IA: los prompts | START8-L03-Q01, Q02, Q03, Q04, Q05 |
| L04 · Cómo mejorar y aprovechar las respuestas | START8-L04-Q01, Q02, Q03, Q04, Q05 |
| L05 · Errores, información falsa y verificación | START8-L05-Q01, Q02, Q03, Q04, Q05 |
| L06 · Privacidad, seguridad y uso responsable | START8-L06-Q01, Q02, Q03, Q04, Q05 |
| L07 · La IA en tu vida cotidiana | START8-L07-Q01, Q02, Q03, Q04, Q05 |
| L08 · Tu primer proyecto completo con IA | START8-L08-Q01, Q02, Q03, Q04, Q05 |

## Requisitos de carga

- Mantener cada source_id exactamente.
- Vincular cada pregunta al lesson_id nuevo de START v0.4.
- No reutilizar los lesson_id históricos de la ruta de cuatro lecciones.
- No publicar la evaluación hasta cerrar editorialmente las ocho lecciones.
- No enviar claves ni justificaciones al cliente.
- Verificar 40 preguntas, 120 opciones y 40 claves privadas.
- Verificar que cada pregunta tenga una única alternativa correcta.
- Revisar que el texto de cada pregunta corresponda a la versión final de su lección.

## Pruebas antes de publicar

- [ ] Recuento 40 / 120 / 40.
- [ ] Cinco preguntas por lección.
- [ ] Ninguna pregunta apunta a una lección histórica.
- [ ] RLS impide leer claves y justificaciones.
- [ ] El cliente no puede enviar puntuación propia.
- [ ] RPC de corrección usa la versión correcta.
- [ ] Idempotencia y numeración de intentos verificadas.
- [ ] Evaluación v1 sigue funcionando sin cambios.
