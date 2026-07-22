// news.json を読み込んで NEWS 一覧を自動生成する
fetch('news.json')
  .then(function (res) { return res.json(); })
  .then(function (posts) {
    // 日付の新しい順に並び替え(id降順でも可。dateで確実に並び替える)
    posts.sort(function (a, b) {
      return new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-'));
    });

    var list = document.getElementById('news-list');
    if (!list) return;

    var html = '';
    posts.forEach(function (post) {
      html += ''
        + '<a class="news-item fade-up" href="news-detail.html?id=' + post.id + '">'
        + '<time>' + post.date + '</time>'
        + '<span class="tag">' + post.tag + '</span>'
        + '<p>' + post.title + '</p>'
        + '<span class="arrow">→</span>'
        + '</a>';
    });
    list.innerHTML = html;

    if (window.observeFadeUps) window.observeFadeUps(list);
  })
  .catch(function (err) {
    console.error('news.json の読み込みに失敗しました:', err);
  });