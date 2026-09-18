// LP一覧:data/lp.json（lp/<フォルダ名>/index.html から GitHub Actions が
// 自動生成するファイル）を読み込み、ホームページにカード一覧を表示する。
// → lp/<フォルダ名>/ に index.html・css・img を置いて push するだけで、
//   Actionsがdata/lp.jsonを自動更新し、反映される。
fetch('data/lp.json', { cache: 'no-store' })
  .then(function (res) { return res.json(); })
  .then(function (items) {
    if (!items || items.length === 0) return;

    var html = items.map(function (lp) {
      return ''
        + '<a class="lp-banner" href="' + lp.url + '">'
        + (lp.thumbnail
            ? '<div class="lp-banner-thumb"><img src="' + lp.thumbnail + '" alt="' + lp.title + '" loading="lazy"></div>'
            : '')
        + '<div class="lp-banner-body">'
        + '<span class="eyebrow">SPECIAL</span>'
        + '<h3>' + lp.title + '</h3>'
        + '<p>' + (lp.description || '') + '</p>'
        + '<span class="more">詳しく見る →</span>'
        + '</div>'
        + '</a>';
    }).join('');

    ['lp-banner-home'].forEach(function (id) {
      var slot = document.getElementById(id);
      if (!slot) return;
      slot.innerHTML = html;
      if (window.observeFadeUps) window.observeFadeUps(slot);
    });
  })
  .catch(function (err) {
    console.error('data/lp.json の読み込みに失敗しました:', err);
  });
