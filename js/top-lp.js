// LP一覧:data/lp.json を読み込み、ホームページにカード一覧を表示する
fetch('data/lp.json', { cache: 'no-store' })
  .then(function (res) {
    if (!res.ok) {
      throw new Error('lp.json の読み込みに失敗しました');
    }
    return res.json();
  })
  .then(function (items) {
    var slot = document.getElementById('lp-banner-home');

    if (!slot) return;

    if (!items || items.length === 0) {
      slot.innerHTML = '';
      return;
    }

    var html = items.map(function (lp) {
      return ''
        + '<a class="lp-banner" href="' + lp.url + '">'
        + (lp.thumbnail
          ? '<div class="lp-banner-thumb">'
          + '<img src="' + lp.thumbnail + '" alt="' + lp.title + '" loading="lazy">'
          + '</div>'
          : '')
        + '<div class="lp-banner-body">'
        + '<span class="eyebrow">SPECIAL</span>'
        + '<h3>' + lp.title + '</h3>'
        + '<p>' + (lp.description || '') + '</p>'
        + '<span class="more">詳しく見る →</span>'
        + '</div>'
        + '</a>';
    }).join('');

    slot.innerHTML = html;

    // フェード処理は使わない
  })
  .catch(function (err) {
    console.error('data/lp.json の読み込みに失敗しました:', err);
  });