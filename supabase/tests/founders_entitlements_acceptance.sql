-- Pruebas de aceptación para ejecutar SOLO contra una rama de desarrollo Supabase.
-- No insertar 201 usuarios simulados en producción.
-- Ejecutar cada bloque en una transacción separada y usar cuentas de prueba verificadas.

-- 1. Estructura y cupo exacto:
select count(*) = 200 as has_exactly_200_slots
from public.founder_slots;

select min(slot_number) = 1 and max(slot_number) = 200 as contiguous_slot_range
from public.founder_slots;

-- 2. RLS y privilegios: el navegador no puede editar plazas, derechos ni auditoría.
select table_name, privilege_type, grantee
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('founder_slots', 'access_grants', 'access_grant_audit', 'professional_profiles')
  and grantee in ('anon', 'authenticated', 'PUBLIC')
order by table_name, grantee, privilege_type;

-- Resultado esperado: authenticated solo SELECT en access_grants/professional_profiles
-- e INSERT/UPDATE en professional_profiles. Ningún privilegio para anon.

-- 3. La función no está disponible para anon y sí para authenticated.
select routine_name, grantee, privilege_type
from information_schema.routine_privileges
where routine_schema = 'public'
  and routine_name = 'claim_founder_entitlement'
  and grantee in ('PUBLIC', 'anon', 'authenticated')
order by grantee;

-- 4. Prueba funcional manual con 201 cuentas de prueba verificadas:
--   a) iniciar sesión como cuentas 1..200, invocar rpc('claim_founder_entitlement')
--      y esperar claim_state='assigned' y plazas 1..200, sin repeticiones.
--   b) repetir la llamada para una de ellas y esperar 'already_assigned' con la misma plaza.
--   c) iniciar sesión como cuenta 201 y esperar 'capacity_reached', sin filas nuevas.
--   d) ejecutar 20 llamadas concurrentes con cuentas verificadas nuevas sobre plazas restantes;
--      esperar una asignación única por cuenta y por plaza.
--   e) con una cuenta no verificada, esperar error email_verification_required.
--   f) desde las mismas sesiones intentar INSERT/UPDATE/DELETE sobre founder_slots,
--      access_grants y access_grant_audit; esperar denegación.
--   g) actualizar professional_profiles solo de la cuenta conectada; intentar usar otro user_id
--      y esperar denegación de RLS.
--   h) ejecutar el asesor de seguridad y comprobar que no quedan avisos 0028/0029
--      para handle_new_user ni rls_auto_enable. La función de reclamación es una excepción
--      documentada: valida auth.uid(), email_confirmed_at y no acepta parámetros.
