// consulta.js - pagina de consulta filtrada (sem modules para compatibilidade file://)

const URL_JSON = 'https://mfpledon.com.br/contatos/contatosJSONv2.php';

function norm(item) {
  const nome = item.nome ?? item.name ?? item.Nome ?? '';
  const telefone = item.telefone ?? item.fone ?? item.telefone1 ?? item.Telefone ?? '';
  const email = item.email ?? item.mail ?? item.Email ?? '';
  const sexo = item.sexo ?? item.Sexo ?? item.genero ?? item.genero_sigla ?? '';
  return { nome, telefone, email, sexo };
}

function renderResultados(container, dados) {
  container.innerHTML = '';
  const frag = document.createDocumentFragment();
  dados.forEach(({ nome, telefone, email }) => {
    const div = document.createElement('div');
    div.className = 'resultado-item';
    const n = nome || '-';
    const t = telefone || '-';
    const e = email || '-';
    div.innerHTML = '<div class="nome">' + n + '</div>' +
                    '<div class="meta">' + t + ' · ' + e + '</div>';
    frag.appendChild(div);
  });
  container.appendChild(frag);
}

async function onSubmit(ev) {
  ev.preventDefault();
  const form = ev.currentTarget;
  const resultados = (window.qs ? window.qs('#resultados') : document.querySelector('#resultados'));

  const selecionado = form.querySelector('input[name="sexo"]:checked');
  if (!selecionado) {
    (window.renderAlert || function(c,m){ c.textContent=m; })(resultados, 'Selecione um sexo para consultar.');
    return;
  }

  const sexo = selecionado.value;
  resultados.innerHTML = '<div class="loading">Consultando...</div>';

  try {
    const resp = await fetch(URL_JSON, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();

    const arr = Array.isArray(json)
      ? json
      : (Array.isArray(json && json.pessoas)
          ? json.pessoas
          : (Array.isArray(json && json.data) ? json.data : []));
    const normalizados = arr.map(norm);
    const s = String(sexo).toUpperCase();
    const filtrados = normalizados.filter(x => {
      const val = String(x.sexo || '').toUpperCase();
      if (s === 'O') {
        // Tratar 'outro': dataset usa '-' para indefinido
        return val !== 'M' && val !== 'F';
      }
      return val === s;
    });

    if (filtrados.length === 0) {
      (window.renderAlert || function(c,m){ c.textContent=m; })(resultados, 'Nenhum resultado encontrado para o filtro informado.');
    } else {
      renderResultados(resultados, filtrados);
      (window.qs ? window.qs('#bloco-resultados') : document.querySelector('#bloco-resultados')).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    console.error(err);
    (window.renderAlert || function(c,m){ c.textContent=m; })(resultados, 'Nao foi possivel obter os dados. Tente novamente.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = (window.qs ? window.qs('#form-consulta') : document.querySelector('#form-consulta'));
  if (form) form.addEventListener('submit', onSubmit);
});
