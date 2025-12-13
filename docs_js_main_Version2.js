// Carica dati da /data/data.json e popola la lista.
async function loadItems() {
  try {
    const res = await fetch('./data/data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Impossibile caricare i dati');
    const items = await res.json();
    renderItems(items);
  } catch (err) {
    console.error(err);
    document.getElementById('items').innerHTML = '<li>Errore caricamento dati</li>';
  }
}

function renderItems(items) {
  const ul = document.getElementById('items');
  ul.innerHTML = '';
  items.forEach(it => {
    const li = document.createElement('li');
    li.textContent = `${it.title} — ${it.description}`;
    ul.appendChild(li);
  });
}

// Filter semplice
document.getElementById('filter').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const lis = Array.from(document.querySelectorAll('#items li'));
  lis.forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

// Gestione invio form (prevent default + feedback)
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('contact-status');
  const formData = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      status.textContent = 'Messaggio inviato. Grazie!';
      form.reset();
    } else {
      const data = await res.json();
      status.textContent = data?.error || 'Errore invio messaggio';
    }
  } catch (err) {
    console.error(err);
    status.textContent = 'Errore di rete, riprova più tardi.';
  }
});

// Avvia
loadItems();