// blog.json を読み込んでカード型一覧を生成する(カテゴリフィルタ + ページネーション付き)
var allPosts = [];
var currentFiltered = [];
var currentPage = 1;
var PER_PAGE = 30;

fetch('blog.json')
  .then(function (res) { return res.json(); })
  .then(function (posts) {
    posts.sort(function (a, b) {
      return new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-'));
    });
    allPosts = posts;
    currentFiltered = posts;
    renderFilter(posts);
    renderPage(1);
  })
  .catch(function (err) {
    console.error('blog.json の読み込みに失敗しました:', err);
  });

function renderFilter(posts) {
  var filterEl = document.getElementById('blog-filter');
  if (!filterEl) return;

  var categories = [];
  posts.forEach(function (post) {
    if (categories.indexOf(post.category) === -1) categories.push(post.category);
  });

  var html = '<button class="filter-btn is-active" data-category="all">ALL</button>';
  categories.forEach(function (cat) {
    html += '<button class="filter-btn" data-category="' + cat + '">' + cat + '</button>';
  });
  filterEl.innerHTML = html;

  filterEl.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterEl.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var cat = btn.getAttribute('data-category');
      currentFiltered = cat === 'all' ? allPosts : allPosts.filter(function (p) { return p.category === cat; });
      renderPage(1); // フィルタを変えたら1ページ目に戻す
    });
  });
}

function renderPage(page) {
  currentPage = page;
  var totalPages = Math.max(1, Math.ceil(currentFiltered.length / PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  var start = (currentPage - 1) * PER_PAGE;
  var pagePosts = currentFiltered.slice(start, start + PER_PAGE);

  renderGrid(pagePosts);
  renderPagination(totalPages);

  // ページ切り替え時にトップへスクロール(グリッドの位置へ)
  var grid = document.getElementById('blog-grid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderGrid(posts) {
  var grid = document.getElementById('blog-grid');
  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML = '<p class="blog-empty">該当する記事がありません。</p>';
    return;
  }

  var html = '';
  posts.forEach(function (post) {
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
}

function renderPagination(totalPages) {
  var pager = document.getElementById('blog-pagination');
  if (!pager) return;

  if (totalPages <= 1) {
    pager.innerHTML = '';
    return;
  }

  var html = '';

  html += '<button class="page-btn page-prev" ' + (currentPage === 1 ? 'disabled' : '') + '>← 前へ</button>';

  for (var i = 1; i <= totalPages; i++) {
    html += '<button class="page-btn page-num' + (i === currentPage ? ' is-active' : '') + '" data-page="' + i + '">' + i + '</button>';
  }

  html += '<button class="page-btn page-next" ' + (currentPage === totalPages ? 'disabled' : '') + '>次へ →</button>';

  pager.innerHTML = html;

  pager.querySelectorAll('.page-num').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPage(parseInt(btn.getAttribute('data-page'), 10));
    });
  });

  var prevBtn = pager.querySelector('.page-prev');
  var nextBtn = pager.querySelector('.page-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { renderPage(currentPage - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { renderPage(currentPage + 1); });
}

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