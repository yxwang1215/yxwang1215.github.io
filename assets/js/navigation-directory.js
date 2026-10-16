// Show one full directory card for each matching query.
(() => {
  "use strict";
  const input = document.getElementById("site-directory-search");
  const clearButton = document.getElementById("site-directory-clear");
  const resetButton = document.getElementById("site-directory-reset");
  const count = document.getElementById("site-directory-count");
  const empty = document.getElementById("site-directory-empty");
  const cards = [...document.querySelectorAll("[data-directory-card]")];
  if (!input || !count || !empty || !cards.length) return;

  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase();
  const records = cards.map((card) => ({
    node: card,
    searchable: normalize(card.textContent + " " + (card.dataset.keywords || ""))
  }));

  function filter() {
    const query = normalize(input.value.trim());
    const terms = query.split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const record of records) {
      const matches = terms.every((term) => record.searchable.includes(term));
      record.node.hidden = !matches;
      if (matches) visible++;
    }
    count.textContent = query
      ? "找到 " + visible + " / " + cards.length + " 个目录"
      : cards.length + " 个目录";
    empty.hidden = visible !== 0;
    if (clearButton) clearButton.hidden = !query;
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
