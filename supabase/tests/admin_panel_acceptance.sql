-- Pruebas de aceptación del panel administrativo. SOLO rama de pruebas.
-- No aplicar ni ejecutar mutaciones en producción sin cuenta de prueba.
select public.is_academy_admin() as current_user_is_admin;

-- Ejecutar con la sesión admin:
select count(*) = 200 as roster_has_200_slots
from public.admin_list_founder_roster();

select * from public.admin_list_instructors();

-- Debe devolver error admin_required con una sesión de alumno:
-- select * from public.admin_list_founder_roster();
-- select * from public.admin_search_users('duck');
-- Verificar que anon no tiene EXECUTE sobre las funciones admin.
select routine_name, grantee, privilege_type
from information_schema.routine_privileges
where routine_schema='public'
  and routine_name in ('is_academy_admin','admin_list_founder_roster','admin_list_instructors','admin_search_users','admin_upsert_instructor','admin_assign_course')
  and grantee in ('PUBLIC','anon','authenticated')
order by routine_name, grantee;
