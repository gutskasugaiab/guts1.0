// lp/<フォルダ名>/index.html を全てスキャンし、
// <title>・meta description(og:description)・meta og:image から
// カード情報を組み立てて data/lp.json に書き出す。
// GitHub Actions（.github/workflows/sync-lp.yml）から push 時に自動実行される。

const fs = require('fs');
const path = require('path');

const LP_DIR = path.join(__dirname, '..', 'lp');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'lp.json');

function extractMetaAttrs(tag) {
  const attrs = {};
  const attrRegex = /([\w:-]+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = attrRegex.exec(tag)) !== null) {
    attrs[m[1].toLowerCase()] = m[2];
  }
  return attrs;
}

function parseLpHtml(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  let description = '';
  let thumbnail = '';

  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  metaTags.forEach((tag) => {
    const attrs = extractMetaAttrs(tag);
    const key = attrs.property || attrs.name;
    if (key === 'og:description' && !description) description = attrs.content || '';
    if (key === 'description' && !description) description = attrs.content || '';
    if (key === 'og:image' && !thumbnail) thumbnail = attrs.content || '';
  });

  return { title, description, thumbnail };
}

function resolveThumbnail(slug, thumbnail) {
  if (!thumbnail) return '';
  if (/^https?:\/\//i.test(thumbnail) || thumbnail.startsWith('/')) return thumbnail;
  return `lp/${slug}/${thumbnail}`;
}

function main() {
  if (!fs.existsSync(LP_DIR)) {
    console.log('lp ディレクトリが見つかりません。data/lp.json を空配列にします。');
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, '[]\n', 'utf-8');
    return;
  }

  const slugs = fs.readdirSync(LP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const list = [];

  slugs.forEach((slug) => {
    const indexPath = path.join(LP_DIR, slug, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    const html = fs.readFileSync(indexPath, 'utf-8');
    const { title, description, thumbnail } = parseLpHtml(html);

    list.push({
      id: slug,
      title: title || slug,
      description,
      thumbnail: resolveThumbnail(slug, thumbnail),
      url: `lp/${slug}/`,
    });
  });

  list.sort((a, b) => a.title.localeCompare(b.title, 'ja'));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(list, null, 2) + '\n', 'utf-8');
  console.log(`OK: ${list.length}件のLPを data/lp.json に書き出しました`);
}

main();
