// トップページ用:news.json から最新3件だけ取得して表示する
fetch('news.json')
  .then(function (res) { return res.json(); })
  .then(function (posts) {
    posts.sort(function (a, b) {
      return new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-'));
    });

    var latest = posts.slice(0, 3); // 最新3件のみ
    var list = document.getElementById('top-news-list');
    if (!list) return;

    var html = '';
    latest.forEach(function (post) {
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