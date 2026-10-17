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
      if (topic !== 'all' && !topics.has(topic)) topic = 'all';
      var count = 0;
      groups.forEach(function (group) {
        group.hidden = topic !== 'all' && group.dataset.workGroup !== topic;
        if (!group.hidden) count += group.querySelectorAll('[data-work-topic]').length;
      });
      buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.workFilter === topic)); });
      status.textContent = count + (count === 1 ? ' work shown.' : ' works shown.');
    }
    function selectHash() {
      var match = /^#works-([a-z-]+)$/.exec(window.location.hash);
      select(match && topics.has(match[1]) ? match[1] : 'all');
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
