-- DuckTronSur IA Academy — H-02 (auditoría integral del 22/10/2026)
-- PROPUESTA EN REVISIÓN: este archivo no ha sido ejecutado en Supabase.
-- Objetivo: retirar únicamente TRUNCATE, TRIGGER y REFERENCES a anon/authenticated
-- sobre las cinco tablas de evaluaciones. Conservar SELECT y políticas RLS.
-- Requisito: autorización expresa, copia de seguridad y validación en entorno aislado.
-- Las migraciones NO se aplican automáticamente por los workflows actuales.
BEGIN;

-- Precondiciones: todas las tablas deben existir, tener RLS y conservar SELECT autenticado.
DO $h02_precheck$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'assessments',
    'assessment_questions',
    'assessment_options',
    'assessment_attempts',
    'assessment_answers'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_class AS c
      JOIN pg_namespace AS n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = table_name
        AND c.relkind = 'r'
        AND c.relrowsecurity
    ) THEN
      RAISE EXCEPTION 'H-02: tabla % inexistente o sin RLS; abortado', table_name;
    END IF;

    IF NOT has_table_privilege(
      'authenticated', format('%I.%I', 'public', table_name), 'SELECT'
    ) THEN
      RAISE EXCEPTION 'H-02: falta SELECT autenticado en %; abortado', table_name;
    END IF;
  END LOOP;
END;
$h02_precheck$;

REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLE
  public.assessments,
  public.assessment_questions,
  public.assessment_options,
  public.assessment_attempts,
  public.assessment_answers
FROM anon, authenticated;

-- Verificación transaccional: si un rol conserva un privilegio sobrante,
-- o pierde SELECT, la migración falla y la transacción hace rollback.
DO $h02_postcheck$
DECLARE
  table_name text;
  checked_role text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'assessments',
    'assessment_questions',
    'assessment_options',
    'assessment_attempts',
    'assessment_answers'
  ] LOOP
    FOREACH checked_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF has_table_privilege(
        checked_role, format('%I.%I', 'public', table_name), 'TRUNCATE'
      ) OR has_table_privilege(
        checked_role, format('%I.%I', 'public', table_name), 'TRIGGER'
      ) OR has_table_privilege(
        checked_role, format('%I.%I', 'public', table_name), 'REFERENCES'
      ) THEN
        RAISE EXCEPTION
          'H-02: quedan privilegios excesivos para % en %; abortado',
          checked_role, table_name;
      END IF;
    END LOOP;
    IF NOT has_table_privilege(
      'authenticated', format('%I.%I', 'public', table_name), 'SELECT'
    ) THEN
      RAISE EXCEPTION
        'H-02: se ha perdido SELECT autenticado en %; abortado', table_name;
    END IF;
  END LOOP;
END;
$h02_postcheck$;

COMMIT;

-- Pruebas posteriores requeridas (fuera de esta migración):
-- 1) Repetir information_schema.role_table_grants / has_table_privilege.
-- 2) Comprobar lectura de evaluaciones con alumno autenticado y RLS.
-- 3) Comprobar lectura denegada a visitantes y acceso ajeno restringido.
-- 4) Comprobar flujo completo de evaluación y RPC desde cuentas de prueba.
-- 5) Registrar resultado y, solo tras aceptación, marcar H-02 VALIDADO.
-- Reversión manual (solo previa autorización): restaurar exclusivamente los
-- GRANT directos capturados en la auditoría anterior. Evitar GRANT ALL.
