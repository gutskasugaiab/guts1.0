(function () {
  var path = location.pathname.split('/').pop() || 'index.html';

  var navLinks = [
    { href: 'index.html', label: 'HOME' },
    { href: 'company.html', label: '会社概要' },
    { href: 'business.html', label: '事業内容' },
    { href: 'news.html', label: 'NEWS' },
    { href: 'blog.html', label: 'BLOG' },
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
    '<a class="logo-mark" href="index.html">' +
    '<video class="logo-video" id="afterVideo" muted playsinline>' +
    '<source src="img/logo.mp4" type="video/mp4">' +
    '</video>' +
    '<img class="logo-image" id="afterVideoImage" src="img/logo.png" alt="GUTS1.0">' +
    '</a>\n' +
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

const loader = document.getElementById('loader');
const loaderVideo = document.getElementById('loaderVideo');
const fadeImage = document.getElementById('fadeImage');
const fadeGif = document.getElementById('fadeGif');

// 「このページ表示がリロード(更新)によるものか」を判定する。
// 別ページからの遷移や初回アクセスは false になり、演出が発火する。
// F5やCtrl+R、ブラウザの更新ボタンでの再読み込みだけ true になる。
function isPageReload() {
  try {
    const entries = performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      return entries[0].type === 'reload';
    }
    // 古いブラウザ向けフォールバック
    if (performance.navigation) {
      return performance.navigation.type === 1;
    }
  } catch (e) {}
  return false;
}

const hasPlayedIntro = isPageReload();

// afterVideoはヘッダー注入(inject)で後から作られる要素のため、都度取得する。
function setupAfterVideo() {
  const afterVideo = document.getElementById('afterVideo');
  const afterVideoImage = document.getElementById('afterVideoImage');
  if (!afterVideo) return;

  if (hasPlayedIntro) {
    // リロード時は動画を再生せず、最初から静止画を表示した状態にする
    if (afterVideoImage) {
      afterVideoImage.classList.add('visible');
    }
    return;
  }

  afterVideo.classList.add('visible');
  afterVideo.play();

  // 動画の再生が終わったら、動画を隠して画像に切り替える
  afterVideo.addEventListener('ended', () => {
    afterVideo.classList.remove('visible');
    if (afterVideoImage) {
      afterVideoImage.classList.add('visible');
    }
  }, { once: true });
}

if (loader && loaderVideo) {
  if (hasPlayedIntro) {
    // リロード時は、ローダーをアニメーションなしで即座に消す
    loader.style.transition = 'none';
    loader.classList.add('loaded');
    setupAfterVideo();
    if (fadeImage) fadeImage.classList.add('visible');
    if (fadeGif) fadeGif.classList.add('visible');
  } else {
    const fadeBeforeEnd = 1;

    loaderVideo.addEventListener('loadedmetadata', () => {
      const duration = loaderVideo.duration;
      const fadeStartTime = Math.max(0, duration - fadeBeforeEnd);

      loaderVideo.addEventListener('timeupdate', function checkTime() {
        if (loaderVideo.currentTime >= fadeStartTime) {
          loader.classList.add('loaded');
          loaderVideo.removeEventListener('timeupdate', checkTime);
        }
      });
    });

    setTimeout(() => {
      loader.classList.add('loaded');
    }, 6000);

    // ローダーが消え始めた瞬間を検知して、画像・GIF・動画をそれぞれのタイミングで出す
    const loaderObserver = new MutationObserver(() => {
      if (loader.classList.contains('loaded')) {
        if (fadeImage) {
          setTimeout(() => {
            fadeImage.classList.add('visible');
          }, 900); // 画像を出すタイミング
        }

        if (fadeGif) {
          setTimeout(() => {
            fadeGif.classList.add('visible');
          }, 400); // GIFを出すタイミング
        }

        setTimeout(setupAfterVideo, 200); // 動画を出すタイミング

        loaderObserver.disconnect();
      }
    });

    loaderObserver.observe(loader, { attributes: true, attributeFilter: ['class'] });
  }
} else {
  // ローディングエフェクトがないページ
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAfterVideo);
  } else {
    setupAfterVideo();
  }
}

const bgVideoBtm = document.getElementById('bgVideoBtm');

if (bgVideoBtm) {
  const bgVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bgVideoBtm.classList.add('visible');
        bgVideoBtm.play();
        bgVideoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bgVideoObserver.observe(bgVideoBtm);
}

const fixedCta = document.querySelector('.fixed-cta');
const footer = document.querySelector('.footer');

if (fixedCta && footer) {
  window.addEventListener('scroll', () => {
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (footerRect.top < windowHeight) {
      fixedCta.style.bottom = (windowHeight - footerRect.top + 20) + "px";
    } else {
      fixedCta.style.bottom = "20px";
    }
  });
}
