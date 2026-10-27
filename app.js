'use strict';

const data = 장데이터;
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');
const clear = document.getElementById('clear');

// 원문은 데이터.js에서 읽고, HTML 문자는 안전하게 이스케이프한다.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function formatBody(text) {
  return text.split(/\n\s*\n/).map(block => {
    if (block.startsWith('### ')) return `<h3>${inline(block.slice(4))}</h3>`;
    return `<p>${inline(block).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

function render(items) {
  count.textContent = `결과 ${items.length}건`;
  list.innerHTML = items.length ? items.map(item => `
    <article class="card" aria-labelledby="chapter-${escapeHtml(item.장)}">
      <span class="label">${escapeHtml(item.장)}장</span>
      <h2 id="chapter-${escapeHtml(item.장)}">${escapeHtml(item.제목)}</h2>
      <div class="body">${formatBody(item.본문)}</div>
    </article>`).join('') : '<p class="empty">검색 결과가 없습니다. 다른 검색어를 입력해 주세요.</p>';
}

function filter() {
  const keyword = q.value.trim().toLocaleLowerCase('ko');
  render(keyword ? data.filter(item =>
    item.제목.toLocaleLowerCase('ko').includes(keyword) ||
    item.본문.toLocaleLowerCase('ko').includes(keyword)
  ) : data);
}

q.addEventListener('input', filter);
clear.addEventListener('click', () => {
  q.value = '';
  filter();
  q.focus();
});
render(data);
