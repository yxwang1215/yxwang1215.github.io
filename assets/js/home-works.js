/* Progressive enhancement: native links and every work remain usable without JS. */
(function () {
  'use strict';
  function init() {
    var root = document.querySelector('.home-works');
    if (!root) return;
    var bar = root.querySelector('.work-filters');
    var buttons = Array.from(root.querySelectorAll('[data-work-filter]'));
    var groups = Array.from(root.querySelectorAll('[data-work-group]'));
    var status = root.querySelector('#work-status');
    var topics = new Set(groups.map(function (group) { return group.dataset.workGroup; }));
    function select(topic) {
      if (topic !== 'all' && topic !== 'first-author' && !topics.has(topic)) topic = 'all';
      var count = 0;
      groups.forEach(function (group) {
        var groupCount = 0;
        group.querySelectorAll('[data-work-topic]').forEach(function (card) {
          card.hidden = topic === 'first-author' && card.dataset.workFirstAuthor !== 'true';
          if (!card.hidden) groupCount += 1;
        });
        group.hidden = groupCount === 0 || (topic !== 'all' && topic !== 'first-author' && group.dataset.workGroup !== topic);
        var groupCountLabel = group.querySelector('.work-topic-count');
        if (groupCountLabel) groupCountLabel.textContent = String(groupCount);
        if (!group.hidden) count += groupCount;
      });
      buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.workFilter === topic)); });
      status.textContent = count + (count === 1 ? ' work shown.' : ' works shown.');
    }
    function selectHash() {
      var match = /^#works-([a-z-]+)$/.exec(window.location.hash);
      select(match ? match[1] : 'all');
    }
    buttons.forEach(function (button) { button.addEventListener('click', function () { select(button.dataset.workFilter); }); });
    bar.hidden = false;
    selectHash();
    window.addEventListener('hashchange', selectHash);
    var dialog = document.querySelector('.work-lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var dialogImage = dialog.querySelector('img');
    var caption = dialog.querySelector('p');
    var opener = null;
    root.querySelectorAll('[data-work-image]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        dialogImage.src = link.href;
        dialogImage.alt = link.querySelector('img').alt;
        caption.textContent = link.dataset.workCaption;
        dialog.showModal();
      });
    });
    dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () {
      dialogImage.removeAttribute('src');
      if (opener) opener.focus({preventScroll: true});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* Content-height masonry for Experience. Retains DOM/read order and degrades
   to a compact, readable CSS grid when JavaScript is disabled. */
(function () {
  'use strict';

  function initExperienceMasonry() {
    var grid = document.querySelector('.home-experience-grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll(':scope > .experience-card'));
    if (!cards.length) return;
    var pending = false;

    function layout() {
      pending = false;
      if (!grid.isConnected) return;

      // Measure intrinsic dimensions before assigning grid row spans.
      cards.forEach(function (card) { card.style.gridRowEnd = 'auto'; });
      var styles = window.getComputedStyle(grid);
      var row = parseFloat(styles.gridAutoRows) || 1;
      var gap = parseFloat(styles.rowGap) || 0;
      cards.forEach(function (card) {
        var height = card.getBoundingClientRect().height;
        var span = Math.max(1, Math.ceil((height + gap) / (row + gap)));
        card.style.gridRowEnd = 'span ' + span;
      });
    }

    function scheduleLayout() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(layout);
    }

    grid.classList.add('experience-masonry');
    scheduleLayout();

    window.addEventListener('resize', scheduleLayout, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(scheduleLayout);
      cards.forEach(function (card) {
        var content = card.querySelector('.edu-content, .intern-content');
        if (content) observer.observe(content);
      });
    }
    cards.forEach(function (card) {
      var image = card.querySelector('img');
      if (image && !image.complete) {
        image.addEventListener('load', scheduleLayout, { once: true });
        image.addEventListener('error', scheduleLayout, { once: true });
      }
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleLayout);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperienceMasonry);
  } else {
    initExperienceMasonry();
  }
})();
