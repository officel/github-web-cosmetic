(function () {
  "use strict"; // Assuming 'use strict' might be good practice, or place it where appropriate.
  let debounceTimer = null;

  function addDeepwikiNav() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) return;

    const [owner, repo] = pathParts;
    const headerSelector = "ul.UnderlineNav-body.list-style-none";
    const ul = document.querySelector(headerSelector);
    if (!ul) return;

    // すでに追加済みなら何もしない
    if (ul.querySelector(".deepwiki-nav-item")) return;

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

  function updatePageTypeClass() {
    const path = location.pathname;

    // 一旦削除
    document.body.classList.remove(
      "is-repo-root",
      "is-issues",
      "is-pull-request",
      "is-actions",
      "is-code-file"
    );

    if (/^\/[^/]+\/[^/]+\/?$/.test(path)) {
      document.body.classList.add("is-repo-root");
    } else if (/\/issues(\/|$)/.test(path)) {
      document.body.classList.add("is-issues");
    } else if (/\/pull\/\d+/.test(path)) {
      document.body.classList.add("is-pull-request");
    } else if (/\/actions(\/|$)/.test(path)) {
      document.body.classList.add("is-actions");
    } else if (/\/blob\//.test(path)) {
      document.body.classList.add("is-code-file");
    }
  }

  function handlePageLoadOrTransition() {
    addDeepwikiNav();
    updatePageTypeClass();
    removeCiPrefix(); // Added call
  }

  function removeCiPrefix() {
    // Selector for CI check titles. This might need adjustment based on GitHub's actual DOM structure.
    // Common selectors for check names:
    // 1. `a.Link--primary[href*="/checks/"] > strong` (for links to check details)
    // 2. `div.merge-status-item .text-emphasized strong` (for status items in PR merge box - often includes the check name)
    // 3. `span.status-heading strong` (another common pattern for headings that might contain check names)
    // We'll try a combination or a more general approach if needed.
    // Let's start with a potentially common one for PR check lists or summaries.
    const ciCheckTitleSelectors = [
      'a.Link--primary[href*="/checks/"] > strong', // Links to check details pages
      '.merge-status-item .text-emphasized', // Status items in PR merge box (often the check name itself)
      // Consider adding more selectors if the above are not comprehensive
      // e.g., 'span.text-emphasized[data-testid="check-run-name"]' if such specific attributes exist
      'div.TimelineItem div.TimelineItem-body div.Box--condensed div.css-truncate.css-truncate-target > strong' // CI check titles in the timeline/conversation view
    ];

    ciCheckTitleSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (el.textContent && el.textContent.includes("Terraform Cloud/*/")) {
          el.textContent = el.textContent.replace("Terraform Cloud/*/", "");
        }
      });
    });
  }

  // 初回ロード + turbo.js に対応
  document.addEventListener("turbo:load", handlePageLoadOrTransition);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handlePageLoadOrTransition);
  } else {
    handlePageLoadOrTransition();
  }

  // URL 変化の検出による SPA 対応
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      // DOM 安定後に実行 (ensure functions run after new page content is likely settled)
      // handlePageLoadOrTransition already calls removeCiPrefix
      setTimeout(handlePageLoadOrTransition, 300);
    } else {
      // For dynamic content changes on the same page (e.g., CI status updates)
      // Debounce the call to removeCiPrefix
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(removeCiPrefix, 150); // Use a shorter timeout for same-page updates
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.body.addEventListener('click', function(event) {
    // Check for "View detail" or "Details" buttons, common in GH CI views
    // Handles cases where click might be on a child element (e.g., span) inside the button/summary
    const potentialButton = event.target.closest('button, summary, [role="button"]');

    if (potentialButton) {
      const textContent = potentialButton.textContent.toLowerCase();
      // Check for "detail" or "details" which are common in GH interface for expanding sections
      if (textContent.includes('detail') || textContent.includes('details')) {
        // In a future step, we will call removeCiPrefix here, likely after a short delay
        // to allow the new content (CI job details) to render.
        // For now, a console log suffices for verification if the environment allowed.
        // The structure itself is the primary goal for this step.
        // Call removeCiPrefix after a delay to allow content to load/render
        setTimeout(removeCiPrefix, 300); // Using 300ms as a reasonable starting delay
      }
    }
  });
})();
