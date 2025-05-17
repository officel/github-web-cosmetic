(function () {
  function addDeepwikiNav() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) return;

    const [owner, repo] = pathParts;
    const headerSelector = "ul.UnderlineNav-body.list-style-none";
    const ul = document.querySelector(headerSelector);
    if (!ul) return;

    // すでに追加済みなら何もしない
    if (ul.querySelector('.deepwiki-nav-item')) return;

    const li = document.createElement("li");
    li.className = "d-inline-flex deepwiki-nav-item";

    const a = document.createElement("a");
    a.href = `https://deepwiki.com/${owner}/${repo}`;
    a.target = "_blank";
    a.className =
      "UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item";

    const img = document.createElement("img");
    img.src = "https://deepwiki.com/favicon.ico";
    img.alt = "Deepwiki";
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.verticalAlign = "middle";
    img.style.marginRight = "8px";
    img.onerror = function () {
      this.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23007acc" viewBox="0 0 16 16"><rect width="14" height="12" x="1" y="2" rx="2" fill="%23fff" stroke="%23007acc" stroke-width="1.5"/><path d="M4 5h8M4 8h8M4 11h5" stroke="%23007acc" stroke-width="1.2" stroke-linecap="round"/></svg>';
    };
    a.appendChild(img);

    const span = document.createElement("span");
    span.textContent = "Deepwiki";
    a.appendChild(span);

    li.appendChild(a);
    ul.appendChild(li);
  }

  // Turbo.js対応: turbo:loadイベントで実行
  document.addEventListener('turbo:load', addDeepwikiNav);
  // 通常のページロードにも対応
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDeepwikiNav);
  } else {
    addDeepwikiNav();
  }
})();
