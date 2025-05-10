(function () {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (pathParts.length < 2) return;

  const [owner, repo] = pathParts;
  const headerSelector = "ul.UnderlineNav-body.list-style-none";
  const ul = document.querySelector(headerSelector);
  if (!ul) return;

  const li = document.createElement("li");
  li.className = "d-inline-flex";

  const a = document.createElement("a");
  a.textContent = "";
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
  a.appendChild(img);

  const span = document.createElement("span");
  span.textContent = "Deepwiki";
  a.appendChild(span);

  li.appendChild(a);
  ul.appendChild(li);
})();
