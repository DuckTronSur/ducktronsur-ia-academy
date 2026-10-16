
(function () {
  const base = window.SUPABASE_URL;
  const key = window.SUPABASE_PUBLISHABLE_KEY;
  const rest = base + '/rest/v1';
  const auth = base + '/auth/v1';
  const state = { session: null, assessment: null, questions: [] };
  const routeLabels = { start: 'START', 'start-v0-4': 'START v0.4', intermedio: 'INTERMEDIO', pro: 'PRO', lab: 'LAB' };
  const rawRoute = new URLSearchParams(location.search).get('ruta');
  const routeSlug = Object.prototype.hasOwnProperty.call(routeLabels, rawRoute) ? rawRoute : 'start';
  const assessmentSlug = routeSlug === 'start-v0-4' ? 'start-v0-4-evaluacion-v0-2' : routeSlug + '-evaluacion-v1';
  const $ = (id) => document.getElementById(id);
  const headers = () => ({ apikey: key, Authorization: 'Bearer ' + (state.session ? state.session.access_token : key), 'Content-Type': 'application/json' });
  const setStatus = (id, text, error, alert) => { $(id).textContent = text; $(id).classList.toggle('alert', Boolean(alert)); $(id).style.color = error ? '#a23b25' : ''; };
  async function json(response) { const text = await response.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { message: text }; } if (!response.ok) throw new Error(data.msg || data.message || data.error_description || 'No se ha podido completar la operación.'); return data; }
  async function authRequest(path, email, password) { return json(await fetch(auth + path, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })); }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }
  async function load() {
    const a = await json(await fetch(rest + '/assessments?slug=eq.' + encodeURIComponent(assessmentSlug) + '&published=eq.true&select=id,slug,title,pass_percent', { headers: headers() }));
    if (!a.length) throw new Error('La evaluación ' + routeLabels[routeSlug] + ' todavía no está disponible.');
    state.assessment = a[0];
    state.questions = await json(await fetch(rest + '/assessment_questions?assessment_id=eq.' + state.assessment.id + '&select=id,position,prompt,assessment_options(id,option_key,option_text,position)&order=position', { headers: headers() }));
    $('assessmentKicker').textContent = routeLabels[routeSlug] + ' · EVALUACIÓN';
    $('assessmentTitle').textContent = 'Evaluación ' + routeLabels[routeSlug];
    $('assessmentMeta').textContent = state.questions.length + ' preguntas · aprobado con el ' + state.assessment.pass_percent + ' % · intentos ilimitados';
    document.querySelector('a[href^="ruta.html"]').href = 'ruta.html?ruta=' + encodeURIComponent(routeSlug);
    $('authCard').classList.add('assessment-hidden'); $('quizCard').classList.remove('assessment-hidden');
    $('quizIntro').innerHTML = '<p>' + state.questions.length + ' preguntas · aprobado: ' + state.assessment.pass_percent + '%</p>';
    $('quizForm').innerHTML = state.questions.map((q, i) => '<fieldset class="assessment-question"><legend><strong>' + (i + 1) + '. ' + escapeHtml(q.prompt) + '</strong></legend>' + q.assessment_options.sort((x, y) => x.position - y.position).map(o => '<label class="assessment-option"><input type="radio" name="q-' + q.id + '" value="' + o.id + '" required> ' + o.option_key + '. ' + escapeHtml(o.option_text) + '</label>').join('') + '</fieldset>').join('');
  }
  async function submit(event) {
    event.preventDefault();
    document.querySelectorAll('.assessment-question.incomplete').forEach((node) => node.classList.remove('incomplete'));
    const unanswered = state.questions.filter((q) => !document.querySelector('input[name="q-' + q.id + '"]:checked'));
    if (unanswered.length) {
      unanswered.forEach((q) => document.querySelector('input[name="q-' + q.id + '"]').closest('.assessment-question').classList.add('incomplete'));
      const first = document.querySelector('.assessment-question.incomplete');
      setStatus('quizStatus', 'Te faltan ' + unanswered.length + (unanswered.length === 1 ? ' pregunta' : ' preguntas') + ' por contestar.', false, true);
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first.querySelector('input').focus({ preventScroll: true });
      return;
    }
    setStatus('quizStatus', 'Enviando y corrigiendo…');
    const answers = state.questions.map((q) => ({ question_id: q.id, selected_option_id: document.querySelector('input[name="q-' + q.id + '"]:checked').value }));
    const result = await json(await fetch(rest + '/rpc/submit_assessment', { method: 'POST', headers: headers(), body: JSON.stringify({ p_assessment_id: state.assessment.id, p_answers: answers, p_request_id: crypto.randomUUID() }) }));
    const data = Array.isArray(result) ? result[0] : result;
    $('result').classList.remove('assessment-hidden'); $('result').classList.toggle('fail', !data.passed); $('result').innerHTML = '<strong>' + (data.passed ? 'Evaluación superada' : 'Evaluación no superada') + '</strong><br>Puntuación: ' + data.score_percent + '% · Intento: ' + data.attempt_number; setStatus('quizStatus', 'Resultado guardado.');
  }
  $('authForm').addEventListener('submit', async (event) => { event.preventDefault(); setStatus('authStatus', 'Iniciando sesión…'); try { state.session = await authRequest('/token?grant_type=password', $('email').value.trim(), $('password').value); await load(); } catch (e) { setStatus('authStatus', e.message, true); } });
  $('signupButton').addEventListener('click', async () => { setStatus('authStatus', 'Creando cuenta…'); try { const result = await authRequest('/signup', $('email').value.trim(), $('password').value); if (result.access_token) { state.session = result; await load(); } else setStatus('authStatus', 'Cuenta creada. Revisa el correo y después inicia sesión.'); } catch (e) { setStatus('authStatus', e.message, true); } });
  $('quizForm').addEventListener('change', (event) => { const question = event.target.closest('.assessment-question'); if (question) question.classList.remove('incomplete'); });
  $('quizForm').addEventListener('submit', (e) => submit(e).catch((err) => setStatus('quizStatus', err.message, true)));
  $('logoutButton').addEventListener('click', () => location.reload());
}());

