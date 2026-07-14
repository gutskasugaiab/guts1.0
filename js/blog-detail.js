// URL の ?id=数字 を見て、該当するブログ記事を blog.json から探して表示する
(function () {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'), 10);

  fetch('blog.json')
    .then(function (res) { return res.json(); })
    .then(function (posts) {
      var post = posts.find(function (p) { return p.id === id; });

      if (!post) {
        document.getElementById('article-title').textContent = '記事が見つかりませんでした';
        document.getElementById('article-body').innerHTML = '<p>お探しの記事は存在しないか、削除された可能性があります。</p>';
        return;
      }

      document.title = post.title + ' | GUTS1.0 株式会社';
      document.getElementById('page-title').textContent = post.title + ' | GUTS1.0 株式会社';
      document.getElementById('page-description').setAttribute('content', post.excerpt);

      document.getElementById('article-category').textContent = post.category;
      document.getElementById('article-category-tag').textContent = post.category;
      document.getElementById('article-title').textContent = post.title;
      document.getElementById('article-date').textContent = post.date;

      var eyecatch = document.getElementById('article-eyecatch');
      eyecatch.src = post.eyecatch;
      eyecatch.alt = post.title;

      var bodyHtml = post.body.map(function (paragraph) {
        return '<p>' + paragraph + '</p>';
      }).join('');
      document.getElementById('article-body').innerHTML = bodyHtml;
    })
    .catch(function (err) {
      console.error('blog.json の読み込みに失敗しました:', err);
    });
})();