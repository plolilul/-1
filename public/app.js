const form = document.getElementById('item-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const listEl = document.getElementById('item-list');
const statusEl = document.getElementById('status');

function showStatus(message) {
  statusEl.textContent = message || '';
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR');
}

function renderItems(items) {
  listEl.innerHTML = '';

  if (items.length === 0) {
    listEl.innerHTML = '<li class="empty">저장된 데이터가 없습니다.</li>';
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item-card';
    li.innerHTML = `
      <div class="item-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.content)}</p>
        <time>${formatDate(item.createdAt)}</time>
      </div>
      <button data-id="${item.id}">삭제</button>
    `;
    listEl.appendChild(li);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function loadItems() {
  showStatus('');
  try {
    const res = await fetch('/api/items');
    if (!res.ok) throw new Error('불러오기 실패');
    const items = await res.json();
    renderItems(items);
  } catch (err) {
    showStatus('데이터를 불러오지 못했습니다: ' + err.message);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showStatus('');

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || '저장 실패');
    }

    titleInput.value = '';
    contentInput.value = '';
    await loadItems();
  } catch (err) {
    showStatus(err.message);
  }
});

listEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;

  try {
    const res = await fetch(`/api/items/${btn.dataset.id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('삭제 실패');
    await loadItems();
  } catch (err) {
    showStatus(err.message);
  }
});

loadItems();
