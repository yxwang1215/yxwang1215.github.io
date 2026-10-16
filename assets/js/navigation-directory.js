// Progressive enhancement for /navigation/: no JavaScript is needed to browse.
(() => {
  "use strict";
  const input = document.querySelector("#site-directory-search");
  const clearButton = document.querySelector("#site-directory-clear");
  const resetButton = document.querySelector("#site-directory-reset");
  const count = document.querySelector("#site-directory-count");
  const empty = document.querySelector("#site-directory-empty");
  const groups = [...document.querySelectorAll("[data-directory-group]")];
  if (!input || !count || !empty || !groups.length) return;

  const sections = groups.map((element) => ({
    element,
    cards: [...element.querySelectorAll("[data-directory-card]")].map((node) => ({
      node,
      searchable: (node.textContent + " " + (node.dataset.keywords || "")).toLocaleLowerCase()
    }))
  }));
  const total = sections.reduce((sum, section) => sum + section.cards.length, 0);

  function filter() {
    const query = input.value.trim().toLocaleLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    for (const section of sections) {
      let sectionCount = 0;
      for (const card of section.cards) {
        const matches = terms.every((term) => card.searchable.includes(term));
        card.node.hidden = !matches;
        if (matches) sectionCount++;
      }
      section.element.hidden = sectionCount === 0;
      visibleCount += sectionCount;
    }

    count.textContent = query
      ? `找到 ${visibleCount} / ${total} 个入口`
      : `${total} 个可访问入口`;
    empty.hidden = visibleCount !== 0;
    if (clearButton) clearButton.hidden = query.length === 0;
  }

  function reset() {
    input.value = "";
    filter();
    input.focus();
  }

  input.addEventListener("input", filter);
  if (clearButton) clearButton.addEventListener("click", reset);
  if (resetButton) resetButton.addEventListener("click", reset);
  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const editable = active && (active.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName));
    if (event.key === "/" && !editable && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      input.focus();
    } else if (event.key === "Escape" && active === input && input.value) {
      event.preventDefault();
      reset();
    }
  });
  filter();
})();
