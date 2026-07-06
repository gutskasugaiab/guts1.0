(function () {
  var path = location.pathname.split('/').pop() || 'index.html';

  var navLinks = [
    { href: 'index.html', label: 'HOME' },
    { href: 'company.html', label: '会社概要' },
    { href: 'business.html', label: '事業内容' },
    { href: 'news.html', label: 'NEWS' },
    { href: 'contact.html', label: 'CONTACT' }
  ];

  function isActive(href) {
    return path === href ? ' class="active"' : '';
  }

  function navHTML() {
    return navLinks.map(function (l) {
      return '<a href="' + l.href + '"' + isActive(l.href) + '>' + l.label + '</a>';
    }).join('\n      ');
  }

  var headerHTML =
    '<a class="logo-mark" href="index.html"><img src="img/logo.png" alt="GUTS1.0"></a>\n' +
    '  <nav class="nav-desktop">\n      ' + navHTML() + '\n  </nav>\n' +
    '  <button class="nav-toggle" aria-label="メニューを開く" aria-expanded="false">\n' +
    '    <span></span><span></span><span></span>\n' +
    '  </button>';

  var mobileNavHTML =
    '<div class="nav-mobile" id="site-nav-mobile">\n' +
    '  <nav>\n      ' + navHTML() + '\n  </nav>\n' +
    '</div>';

  var footerHTML =
    '<div>\n' +
    '    <a class="foot-brand" href="index.html"><img src="img/logo.png" alt="GUTS1.0"></a>\n' +
    '  </div>\n' +
    '  <div class="foot-links">\n      ' + navHTML() + '\n' +
    '    <a href="privacy.html">プライバシーポリシー</a>\n' +
    '    <a href="tokushoho.html">特定商取引法に基づく表記</a>\n' +
    '  </div>\n' +
    '  <div class="foot-copy">© 2026 GUTS1.0 株式会社. All Rights Reserved.</div>';

  function setupMobileNav(toggle, mobileNav) {
    if (!toggle || !mobileNav) return;

    function close() {
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    function open() {
      mobileNav.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) close(); else open();
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  function inject() {
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');
    if (headerEl) {
      headerEl.innerHTML = headerHTML;
      // backdrop-filterがかかったheader内に position:fixed の全画面メニューを置くと
      // headerの箱を基準にしてしまい高さが崩れるため、body直下に切り離す
      var wrapper = document.createElement('div');
      wrapper.innerHTML = mobileNavHTML;
      var mobileNav = wrapper.firstElementChild;
      document.body.appendChild(mobileNav);

      var toggle = headerEl.querySelector('.nav-toggle');
      setupMobileNav(toggle, mobileNav);
    }
    if (footerEl) footerEl.innerHTML = footerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();