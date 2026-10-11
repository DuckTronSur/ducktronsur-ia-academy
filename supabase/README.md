# Sistema de alumnos

Este directorio contiene el modelo inicial de la base de datos de DuckTronSur IA Academy.

Incluye perfiles, roles, cursos, lecciones, inscripciones y progreso. Las políticas RLS impiden que un alumno consulte o modifique los datos de otro alumno.

## Pendiente antes de producción

- Crear el proyecto Supabase en la cuenta autorizada.
- Elegir la región de almacenamiento adecuada.
- Ejecutar `schema.sql` en el editor SQL.
- Configurar URL pública y clave pública en el campus.
- Mantener la clave de servicio únicamente fuera del navegador.
- Probar registro, recuperación de contraseña, acceso y eliminación de cuenta con datos de prueba.

## Seguridad de perfiles

El esquema aplica mínimo privilegio en `public.profiles`: los usuarios autenticados solo pueden actualizar `display_name`. `id`, `role`, `created_at` y `updated_at` quedan protegidos. El campo `updated_at` se mantiene mediante un trigger de servidor.

La validación transaccional con el rol `authenticated` confirmó el aislamiento RLS y el rechazo de actualizaciones sobre campos protegidos. La prueba final con JWT real de una cuenta de alumno queda reservada para una cuenta de prueba no personal.
