/**
 * Shared, local-only tool directory for /tools/ and all standalone PDF utilities.
 * Keep paths and descriptions here so every workspace shows the same navigation.
 */
(() => {
  "use strict";
  const tools = [
    {id:"scan",group:"IMAGE",title:"扫描增强与导出",detail:"自动净白、文字锐化、裁剪；导出 PDF 或图片",format:"PNG · JPG · WebP → PDF / IMG",href:"/tools/#scan"},
    {id:"compress",group:"COMPRESS",title:"文件压缩",detail:"压缩 PDF、PNG、JPG、WebP，查看前后体积",format:"PDF · PNG · JPG · WebP",href:"/tools/#compress"},
    {id:"png",group:"IMAGE",title:"PNG 转 PDF",detail:"批量 PNG 排序、页面尺寸、页边距与质量设置",format:"PNG → PDF",href:"/tools/png-to-pdf-simple/"},
    {id:"mixed",group:"PDF",title:"图片 + PDF 合并",detail:"把 PNG 图片和 PDF 按指定顺序合为一份文件",format:"PNG + PDF → PDF",href:"/tools/mixed-to-pdf/"},
    {id:"merge",group:"PDF",title:"PDF 合并",detail:"合并多份 PDF，并可选取指定页面",format:"PDF + PDF → PDF",href:"/tools/merge-pdf/"},
    {id:"split",group:"PDF",title:"PDF 拆分",detail:"逐页、每 N 页或按自定义范围拆分 PDF",format:"PDF → PDF / ZIP",href:"/tools/split-pdf/"},
    {id:"extract",group:"PDF",title:"提取 PDF 页面",detail:"选取需要的页码，生成独立 PDF 文件",format:"PDF → PDF",href:"/tools/extract-pdf/"},
    {id:"organize",group:"PDF",title:"PDF 页面整理",detail:"逐页排序、旋转或移除页面后重新导出",format:"PDF → PDF",href:"/tools/organize-pdf/"}
  ];
  const mount = document.getElementById("tool-directory");
  if (!mount) return;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const section = element("section", "tool-switcher");
  section.setAttribute("aria-labelledby", "tool-switcher-title");
  const header = element("div", "tool-switcher__header");
  const intro = element("div", "tool-switcher__intro");
  intro.append(element("span", "tool-switcher__eyebrow", "TOOLS / WORKSPACES"));
  intro.append(element("h2", "tool-switcher__title", "工具导航"));
  intro.append(element("p", "tool-switcher__note", "选择工具即可进入对应工作区。各子页面可以直接互相切换。"));
  const home = element("a", "tool-switcher__home", "工具首页 ↗");
  home.href = "/tools/";
  header.append(intro, home);

  const nav = element("nav", "tool-switcher__grid");
  nav.setAttribute("aria-label", "全部工具与功能说明");
  for (const [index, tool] of tools.entries()) {
    const link = element("a", "tool-switcher__item");
    link.href = tool.href;
    link.dataset.toolTarget = tool.id;
    const top = element("span", "tool-switcher__item-top");
    top.append(element("span", "tool-switcher__number", String(index+1).padStart(2,"0") + " / " + tool.group));
    top.append(element("span", "tool-switcher__arrow", "↗"));
    link.append(top);
    link.append(element("strong", "tool-switcher__item-name", tool.title));
    link.append(element("span", "tool-switcher__item-detail", tool.detail));
    link.append(element("span", "tool-switcher__item-format", tool.format));
    nav.append(link);
  }

  const note = element("p", "tool-switcher__footnote", "页面切换不会转移已导入的文件或未下载的处理结果，请先保存当前成果。");
  section.append(header, nav, note);
  mount.replaceChildren(section);

  function currentTool() {
    const path = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") + "/";
    if (path === "/tools/") return location.hash === "#compress" ? "compress" : "scan";
    const byPath = {
      "/tools/png-to-pdf-simple/": "png",
      "/tools/mixed-to-pdf/": "mixed",
      "/tools/merge-pdf/": "merge",
      "/tools/split-pdf/": "split",
      "/tools/extract-pdf/": "extract",
      "/tools/organize-pdf/": "organize"
    };
    return byPath[path] || "";
  }
  function refreshCurrent() {
    const key = currentTool();
    for (const link of nav.querySelectorAll("[data-tool-target]")) {
      const active = link.dataset.toolTarget === key;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }
  window.addEventListener("hashchange", refreshCurrent);
  window.addEventListener("tool-workspace-change", refreshCurrent);
  refreshCurrent();
})();
