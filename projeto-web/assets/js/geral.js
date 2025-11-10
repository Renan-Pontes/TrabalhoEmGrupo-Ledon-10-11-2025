// geral.js - injeta HTML remoto dentro de #conteudo-servidor (compat file://)

const URL_HTML = 'https://mfpledon.com.br/contatos/contatosHTMLv2.php';

async function carregar() {
  const alvo = (window.qs ? window.qs('#conteudo-servidor') : document.querySelector('#conteudo-servidor'));
  try {
    const resp = await fetch(URL_HTML, { headers: { 'Accept': 'text/html' } });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const html = await resp.text();
    alvo.innerHTML = html;
  } catch (err) {
    console.error(err);
    (window.renderAlert || function(c,m){ c.textContent=m; })(alvo, 'Nao foi possivel carregar o conteudo do servidor.');
  }
}

document.addEventListener('DOMContentLoaded', carregar);
