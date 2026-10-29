(function () {
  const form = document.getElementById('manage-form');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const tokenInput = document.getElementById('mg-token');
  if (params.get('token') && tokenInput) tokenInput.value = params.get('token');
  const action = document.getElementById('mg-action');
  const note = document.getElementById('reschedule-note');
  const alertEl = document.getElementById('manage-alert');
  const result = document.getElementById('manage-result');
  action?.addEventListener('change', () => { if (note) note.hidden = action.value !== 'reschedule'; });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!alertEl || !result || !action || !tokenInput) return;
    alertEl.hidden = true;
    try {
      let data;
      if (window.DemoAPI && !window.SITE_CONFIG?.APPS_SCRIPT_URL) {
        data = await window.DemoAPI.manage({ token: tokenInput.value.trim(), action: action.value, note: document.getElementById('mg-note')?.value.trim() || '' });
      } else {
        const response = await fetch(window.SITE_CONFIG?.APPS_SCRIPT_URL, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'manage', token: tokenInput.value.trim(), manageAction: action.value, note: document.getElementById('mg-note')?.value.trim() || '' }),
        });
        data = await response.json();
      }
      if (!data.ok) throw new Error(data.error || 'Request failed');
      result.replaceChildren();
      const heading = document.createElement('h3');
      heading.className = 'mt-0';
      heading.textContent = 'Result';
      const pre = document.createElement('pre');
      pre.style.cssText = 'white-space:pre-wrap;font-family:inherit;';
      pre.textContent = typeof data.message === 'string' ? data.message : JSON.stringify(data.booking || data, null, 2);
      result.append(heading, pre);
      result.hidden = false;
      alertEl.className = 'alert alert-success';
      alertEl.textContent = data.message || 'Done.';
    } catch (error) {
      alertEl.className = 'alert alert-error';
      alertEl.textContent = error instanceof Error ? error.message : 'Unable to process request.';
    }
    alertEl.hidden = false;
  });
})();
