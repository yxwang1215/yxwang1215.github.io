/** Old bookmarks are compatibility redirects, not separate applications. */
(() => {
 const target=document.currentScript?.dataset.target;
 if(typeof target==='string'&&/^\/tools\/#(?:image|pdf)(?:\/[a-z-]+)?$/.test(target))location.replace(target);
})();
