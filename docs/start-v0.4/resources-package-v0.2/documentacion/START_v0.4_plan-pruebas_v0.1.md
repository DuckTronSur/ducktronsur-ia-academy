# Plan de pruebas — START v0.4 — v0.1

Estado: PENDIENTE DE EJECUCIÓN. El paquete no constituye una auditoría aprobada.

## Condiciones de entrada
- Revisión editorial y código/correspondencia Q01–Q05 disponibles en entorno aislado; sin tocar producción.
- Inventario definitivo de recursos, textos alternativos y captura de origen/fecha para cada imagen real.
- Cuenta de prueba sin datos personales; acceso facilitado manualmente por el responsable si es necesario.

## Matriz de comprobación
| ID | Prueba | Método | Aceptación | Estado |
|---|---|---|---|---|
| T01 | Móvil 320/375/390/430 px | Navegación y capturas en navegador real | Sin scroll horizontal ni recortes; texto legible | PENDIENTE |
| T02 | Escritorio 1280/1440/1920 px | Revisar cada lección | Alineación y proporciones estables | PENDIENTE |
| T03 | Zoom 200% y 400% | Zoom navegador/reflow | Sin pérdida de contenido ni controles ocultos | PENDIENTE |
| T04 | Contraste | Medición WCAG 2.2 AA de pares reales | ≥4.5:1 texto normal; ≥3:1 texto grande e interfaz | PENDIENTE |
| T05 | Teclado y foco | Tab/Shift+Tab/Enter/Escape | Secuencia lógica, foco visible, sin trampas | PENDIENTE |
| T06 | Texto alternativo | Lector de pantalla y revisión de contexto | Describe función; imágenes decorativas vacías; no redundancia | PENDIENTE |
| T07 | Navegación L01–L08 | Inicio, anterior, siguiente, volver | Ocho lecciones accesibles sin enlaces rotos | PENDIENTE |
| T08 | Evaluaciones Q01–Q05 | Comparar matriz docente con contenido de cada L | 5 preguntas válidas por lección; 40 códigos únicos; respuestas docentes protegidas | PENDIENTE |
| T09 | Recursos gráficos | DevTools y red en entorno aislado | Sin deformación, imágenes responsivas, sin recortes | PENDIENTE |
| T10 | Carga y formatos | Lighthouse/red y caché deshabilitada | Peso individual auditado y carga razonable en móvil real | PENDIENTE |
| T11 | Vigencia | Revisión de UI de proveedores y fecha | Capturas auténticas fechadas, cuentas/región/plan explicitados | PENDIENTE |
| T12 | Privacidad | Revisión de todos los archivos y capturas | Sin PII, secretos, tokens, rutas privadas ni identificadores | PENDIENTE |
| T13 | Semántica | HTML, títulos, labels y lectores | Etiquetas correctas, estructura lógica, idioma español | PENDIENTE |
| T14 | Evaluación final | L08 proyecto y rúbrica | Actividad final y revisión humana coherentes con la lección | PENDIENTE |

## Códigos y correspondencias de evaluación a revisar
- L01: START8-L01-Q01, START8-L01-Q02, START8-L01-Q03, START8-L01-Q04, START8-L01-Q05 — **PENDIENTE de cotejo con banco docente**.
- L02: START8-L02-Q01, START8-L02-Q02, START8-L02-Q03, START8-L02-Q04, START8-L02-Q05 — **PENDIENTE de cotejo con banco docente**.
- L03: START8-L03-Q01, START8-L03-Q02, START8-L03-Q03, START8-L03-Q04, START8-L03-Q05 — **PENDIENTE de cotejo con banco docente**.
- L04: START8-L04-Q01, START8-L04-Q02, START8-L04-Q03, START8-L04-Q04, START8-L04-Q05 — **PENDIENTE de cotejo con banco docente**.
- L05: START8-L05-Q01, START8-L05-Q02, START8-L05-Q03, START8-L05-Q04, START8-L05-Q05 — **PENDIENTE de cotejo con banco docente**.
- L06: START8-L06-Q01, START8-L06-Q02, START8-L06-Q03, START8-L06-Q04, START8-L06-Q05 — **PENDIENTE de cotejo con banco docente**.
- L07: START8-L07-Q01, START8-L07-Q02, START8-L07-Q03, START8-L07-Q04, START8-L07-Q05 — **PENDIENTE de cotejo con banco docente**.
- L08: START8-L08-Q01, START8-L08-Q02, START8-L08-Q03, START8-L08-Q04, START8-L08-Q05 — **PENDIENTE de cotejo con banco docente**.

## Registro de resultados
Para cada Txx anotar: fecha/hora, navegador/versión, SO/dispositivo, dimensión, probador, evidencia, incidencia, severidad, corrección, repetición y aprobación. Capturas de prueba únicamente con datos ficticios.

## Puertas de publicación
Requiere revisión editorial; examen de funciones e interfaces actuales; revisión normativa; accesibilidad; aprobación humana de los 40 ítems; piloto autorizado posteriormente; aprobación explícita de integración. Ninguna puerta se considera superada por crear estos archivos.
