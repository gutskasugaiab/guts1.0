// URL の ?id=数字 を見て、該当する記事を news.json から探して表示する
(function () {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'), 10);

  fetch('news.json')
    .then(function (res) { return res.json(); })
    .then(function (posts) {
      var post = posts.find(function (p) { return p.id === id; });

      if (!post) {
        document.getElementById('article-title').textContent = '記事が見つかりませんでした';
        document.getElementById('article-body').innerHTML = '<p>お探しの記事は存在しないか、削除された可能性があります。</p>';
        return;
      }

      // タイトル・メタ情報(SEO)
      document.title = post.title + ' | GUTS1.0 株式会社';
      document.getElementById('page-title').textContent = post.title + ' | GUTS1.0 株式会社';
      document.getElementById('page-description').setAttribute('content', post.description);

      // 本文エリア
      document.getElementById('article-eyebrow').textContent = post.tag;
      document.getElementById('article-title').textContent = post.title;
      document.getElementById('article-date').textContent = post.date;
      document.getElementById('article-tag').textContent = post.tag;

      var bodyHtml = post.body.map(function (paragraph) {
        return '<p>' + paragraph + '</p>';
      }).join('');
      document.getElementById('article-body').innerHTML = bodyHtml;
    })
    .catch(function (err) {
      console.error('news.json の読み込みに失敗しました:', err);
    });
})();