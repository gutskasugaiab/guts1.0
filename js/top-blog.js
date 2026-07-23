// トップページ用:blog.json から最新3件だけ取得してカード表示する
fetch('blog.json')
  .then(function (res) { return res.json(); })
  .then(function (posts) {
    posts.sort(function (a, b) {
      return new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-'));
    });

    var latest = posts.slice(0, 3); // 最新3件のみ
    var grid = document.getElementById('top-blog-grid');
    if (!grid) return;

    var html = '';
    latest.forEach(function (post) {
      html += ''
        + '<a class="blog-card fade-up" href="blog-detail.html?id=' + post.id + '">'
        + '<div class="blog-card-image">'
        + '<img src="' + post.eyecatch + '" alt="' + post.title + '" loading="lazy">'
        + '</div>'
        + '<div class="blog-card-body">'
        + '<span class="tag">' + post.category + '</span>'
        + '<time>' + post.date + '</time>'
        + '<h3>' + post.title + '</h3>'
        + '<p>' + post.excerpt + '</p>'
        + '</div>'
        + '</a>';
    });
    grid.innerHTML = html;

    if (window.observeFadeUps) window.observeFadeUps(grid);
  })
  .catch(function (err) {
    console.error('blog.json の読み込みに失敗しました:', err);
  });

const fadeUps = document.querySelectorAll('.fade-up');

const fadeUpObserver = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {

      entry.target.classList.add('show');

    }

  });

}, {
  threshold: 0.2
});

fadeUps.forEach((fadeUp) => {
  fadeUpObserver.observe(fadeUp);
});