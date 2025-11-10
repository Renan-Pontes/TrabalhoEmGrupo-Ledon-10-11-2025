// main.js — utilidades compartilhadas
// - Marca link ativo na navbar
// - Helpers: qs, qsa, renderAlert

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function makeAlert(message, kind = 'error') {
  const div = document.createElement('div');
  div.className = 'alert';
  div.role = 'alert';
  div.textContent = message;
  return div;
}

function renderAlert(container, message) {
  const alert = makeAlert(message);
  container.innerHTML = '';
  container.appendChild(alert);
}

function setActiveNav() {
  const links = document.querySelectorAll('.nav a');
  const pathname = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  links.forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === pathname) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try { setActiveNav(); } catch (_) {}
  // Expõe helpers se necessário
  window.qs = qs;
  window.qsa = qsa;
  window.renderAlert = renderAlert;
});
