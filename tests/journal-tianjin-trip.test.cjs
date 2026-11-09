const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const article = read("_diary/2026-10-25-tianjin-pku-ds-lab.md");
const base = "images/diary/2026-10-tianjin-ds-lab/";

test("Tianjin trip is dated and tagged correctly", () => {
  assert.match(article, /date: 2026-10-25 00:00:00 \+0800/);
  assert.match(article, /2026 年 10 月 23—25 日/);
  assert.match(article, /PKU DS Lab/);
  assert.match(article, /- 天津/);
  assert.match(article, /cover: "\/images\/diary\/2026-10-tianjin-ds-lab\/tianjin-eye\.jpg"/);
});

test("Tianjin post contains all 16 uploaded photographs", () => {
  const galleryImages = [...article.matchAll(/<img[^>]+src="(\/images\/diary\/2026-10-tianjin-ds-lab\/[^"]+\.jpg)"[^>]+alt="[^"]+"/g)]
    .map(match => match[1]);
  assert.equal(galleryImages.length, 15);
  assert.equal(new Set(galleryImages).size, 15);
  const cover = "/images/diary/2026-10-tianjin-ds-lab/tianjin-eye.jpg";
  assert.equal(galleryImages.includes(cover), false);
  for (const image of [...galleryImages, cover]) {
    assert.ok(fs.existsSync(path.join(root, image.slice(1))), `Missing image: ${image}`);
  }
  const uploaded = fs.readdirSync(path.join(root, base)).filter(name => name.endsWith(".jpg"));
  assert.equal(uploaded.length, 16);
});

test("Tianjin gallery stylesheet is loaded only on matching Journal entry", () => {
  const head = read("_includes/head/custom.html");
  assert.match(head, /page\.url contains 'tianjin-pku-ds-lab'/);
  assert.match(head, /journal-tianjin-trip\.css/);
  const css = read("assets/css/journal-tianjin-trip.css");
  assert.match(css, /\.journal-shell--entry \.tianjin-gallery/);
  assert.match(css, /@media \(max-width: 620px\)/);
});
