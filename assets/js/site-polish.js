(() => {
  "use strict";

  const normalize = (value) =>
    (value || "")
      .toString()
      .normalize("NFKC")
      .toLocaleLowerCase()
      .trim();

  const enhanceLinks = () => {
    document.querySelectorAll("a[href]").forEach((link) => {
      const rawHref = link.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (_error) {
        return;
      }

      if (url.origin !== window.location.origin) {
        link.target = "_blank";
        const rel = new Set((link.rel || "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        link.rel = Array.from(rel).join(" ");
      } else if (link.dataset.keepNewTab !== "true") {
        link.removeAttribute("target");
      }
    });
  };

  const setupJournalDiscovery = () => {
    const toolbar = document.querySelector("[data-journal-toolbar]");
    if (!toolbar) return;

    const items = Array.from(document.querySelectorAll("[data-journal-item]"));
    const search = toolbar.querySelector("[data-journal-search]");
    const filterButtons = Array.from(
      toolbar.querySelectorAll("[data-journal-filter]")
    );
    const count = toolbar.querySelector("[data-journal-visible-count]");
    const noResults = document.querySelector("[data-journal-no-results]");

    let activeTag = "all";

    const applyFilters = () => {
      const query = normalize(search?.value);
      let visible = 0;

      items.forEach((item) => {
        const searchable = normalize(item.dataset.search);
        const tags = normalize(item.dataset.tags)
          .split("|")
          .filter(Boolean);
        const matchesQuery = !query || searchable.includes(query);
        const matchesTag = activeTag === "all" || tags.includes(activeTag);
        const shouldShow = matchesQuery && matchesTag;

        item.hidden = !shouldShow;
        if (shouldShow) visible += 1;
      });

      if (count) count.textContent = `${visible} 篇可见`;
      if (noResults) noResults.hidden = visible !== 0;
      document.body.classList.toggle(
        "journal-is-filtering",
        Boolean(query) || activeTag !== "all"
      );
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeTag = normalize(button.dataset.journalFilter) || "all";
        filterButtons.forEach((candidate) => {
          const isActive = candidate === button;
          candidate.classList.toggle("is-active", isActive);
          candidate.setAttribute("aria-pressed", String(isActive));
        });
        applyFilters();
      });
    });

    search?.addEventListener("input", applyFilters);
    search?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        search.value = "";
        search.blur();
        applyFilters();
      }
    });
  };

  const setupCopyLinks = () => {
    const copyText = async (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    };

    document.querySelectorAll("[data-copy-link]").forEach((button) => {
      button.addEventListener("click", async () => {
        const label = button.querySelector("[data-copy-label]");
        const defaultLabel = button.dataset.copyDefault || "Copy link";
        const successLabel = button.dataset.copySuccess || "Copied";

        try {
          await copyText(window.location.href);
          if (label) label.textContent = successLabel;
          button.classList.add("is-copied");
          window.setTimeout(() => {
            if (label) label.textContent = defaultLabel;
            button.classList.remove("is-copied");
          }, 1600);
        } catch (_error) {
          if (label) label.textContent = defaultLabel;
        }
      });
    });
  };

  const setupReadingProgress = () => {
    const article = document.querySelector("[data-journal-content]");
    const bar = document.querySelector("[data-reading-progress]");
    if (!article || !bar) return;

    let ticking = false;

    const update = () => {
      const start = article.getBoundingClientRect().top + window.scrollY;
      const end = start + article.offsetHeight - window.innerHeight * 0.45;
      const distance = Math.max(end - start, 1);
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / distance)
      );

      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  const setupJournalToc = () => {
    const toc = document.querySelector("[data-journal-toc]");
    const content = document.querySelector("[data-journal-content]");
    const nav = toc?.querySelector("nav");
    if (!toc || !content || !nav) return;

    const headings = Array.from(content.querySelectorAll("h2, h3"));
    if (headings.length < 2) return;

    const list = document.createElement("ol");

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `journal-section-${index + 1}`;

      const item = document.createElement("li");
      item.className = heading.tagName === "H3" ? "is-subsection" : "";

      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent || `Section ${index + 1}`;

      item.appendChild(link);
      list.appendChild(item);
    });

    nav.appendChild(list);
    toc.hidden = false;

    if (!("IntersectionObserver" in window)) return;

    const links = new Map(
      Array.from(nav.querySelectorAll("a")).map((link) => [
        decodeURIComponent(link.hash.slice(1)),
        link,
      ])
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = links.get(entry.target.id);
          if (!link || !entry.isIntersecting) return;
          links.forEach((candidate) => candidate.classList.remove("is-active"));
          link.classList.add("is-active");
        });
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
  };

  const boot = () => {
    enhanceLinks();
    setupJournalDiscovery();
    setupCopyLinks();
    setupReadingProgress();
    setupJournalToc();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
