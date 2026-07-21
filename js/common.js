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
      return '<a href="' + l.href + '"' + isActive(l.href) + '>' +
        l.label +
        '</a>';
    }).join('\n      ');
  }


  /* =========================================
     HEADER HTML
  ========================================= */

  var headerHTML =
    '<a class="logo-mark" href="index.html">' +
    '<video class="logo-video" id="afterVideo" muted playsinline>' +
    '<source src="img/logo.mp4" type="video/mp4">' +
    '</video>' +
    '<img class="logo-image" id="afterVideoImage" src="img/logo-top.png" alt="GUTS1.0">' +
    '</a>\n' +

    '<nav class="nav-desktop">\n' +
    '  ' + navHTML() + '\n' +
    '</nav>\n' +

    '<button class="nav-toggle" aria-label="メニューを開く" aria-expanded="false">' +
    '<span></span>' +
    '<span></span>' +
    '<span></span>' +
    '</button>';


  /* =========================================
     MOBILE NAV HTML
  ========================================= */

  var mobileNavHTML =
    '<div class="nav-mobile" id="site-nav-mobile">' +
    '<nav>' +
    navHTML() +
    '</nav>' +
    '</div>';


  /* =========================================
     FOOTER HTML
  ========================================= */

  var footerHTML =
    '<div>' +
    '<a class="foot-brand" href="index.html">' +
    '<img src="img/logo.png" alt="GUTS1.0">' +
    '</a>' +
    '</div>' +

    '<div class="foot-links">' +
    navHTML() +
    '<a href="privacy.html">プライバシーポリシー</a>' +
    '<a href="tokushoho.html">特定商取引法に基づく表記</a>' +
    '</div>' +

    '<div class="foot-copy">' +
    '© 2026 GUTS1.0 株式会社. All Rights Reserved.' +
    '</div>';


  /* =========================================
     MOBILE NAV 開閉
  ========================================= */

  function setupMobileNav(toggle, mobileNav, headerBg) {

    if (!toggle || !mobileNav) return;


    /* 閉じる */
    function close() {

      mobileNav.classList.remove('open');

      toggle.classList.remove('open');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

      toggle.setAttribute(
        'aria-label',
        'メニューを開く'
      );

      /* 背景ページのスクロールを解除 */
      document.body.style.overflow = '';

      /* ヘッダー背景を通常状態へ */
      if (headerBg) {
        headerBg.classList.remove('open');
      }
    }


    /* 開く */
    function open() {

      mobileNav.classList.add('open');

      toggle.classList.add('open');

      toggle.setAttribute(
        'aria-expanded',
        'true'
      );

      toggle.setAttribute(
        'aria-label',
        'メニューを閉じる'
      );

      /* 背景ページをスクロールさせない */
      document.body.style.overflow = 'hidden';

      /* ヘッダー背景を黒にする */
      if (headerBg) {
        headerBg.classList.add('open');
      }
    }


    /* ハンバーガークリック */
    toggle.addEventListener('click', function () {

      if (mobileNav.classList.contains('open')) {
        close();
      } else {
        open();
      }

    });


    /* ナビリンクをクリックしたら閉じる */
    mobileNav.querySelectorAll('a').forEach(function (a) {

      a.addEventListener('click', function () {
        close();
      });

    });

  }


  /* =========================================
     HEADER / NAV / FOOTER INJECT
  ========================================= */

  function inject() {

    var headerEl =
      document.getElementById('site-header');

    var footerEl =
      document.getElementById('site-footer');


    /* -----------------------------------------
       HEADER
    ----------------------------------------- */

    if (headerEl) {

      headerEl.innerHTML = headerHTML;


      /*
       * ヘッダー背景専用レイヤー
       *
       * body直下に配置することで、
       * headerのスタッキングコンテキストに
       * 影響されないようにする
       */

      var headerBg =
        document.createElement('div');

      headerBg.className =
        'header-bg-layer';

      document.body.appendChild(
        headerBg
      );


      /*
       * モバイルナビ
       *
       * headerの外、
       * body直下に配置
       */

      var wrapper =
        document.createElement('div');

      wrapper.innerHTML =
        mobileNavHTML;

      var mobileNav =
        wrapper.firstElementChild;

      document.body.appendChild(
        mobileNav
      );


      /*
       * ハンバーガーボタン取得
       */

      var toggle =
        headerEl.querySelector(
          '.nav-toggle'
        );


      /*
       * モバイルナビ開閉設定
       */

      setupMobileNav(
        toggle,
        mobileNav,
        headerBg
      );

    }


    /* -----------------------------------------
       FOOTER
    ----------------------------------------- */

    if (footerEl) {

      footerEl.innerHTML =
        footerHTML;

    }

  }


  /* =========================================
     DOM READY
  ========================================= */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      inject
    );

  } else {

    inject();

  }

})();



/* ===================================================
   FADE UP
=================================================== */

const fadeUps =
  document.querySelectorAll('.fade-up');

const fadeUpObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'show'
            );

          }

        }
      );

    },
    {
      threshold: 0.2
    }
  );

fadeUps.forEach(
  (fadeUp) => {

    fadeUpObserver.observe(
      fadeUp
    );

  }
);



/* ===================================================
   LOADER
=================================================== */

const loader =
  document.getElementById('loader');

const loaderVideo =
  document.getElementById('loaderVideo');

const fadeImage =
  document.getElementById('fadeImage');

const fadeGif =
  document.getElementById('fadeGif');



/* ===================================================
   PAGE RELOAD CHECK
=================================================== */

function isPageReload() {

  try {

    const entries =
      performance.getEntriesByType(
        'navigation'
      );

    if (
      entries.length > 0
    ) {

      return (
        entries[0].type === 'reload'
      );

    }

    if (
      performance.navigation
    ) {

      return (
        performance.navigation.type === 1
      );

    }

  } catch (e) { }

  return false;

}


const hasPlayedIntro =
  isPageReload();



/* ===================================================
   HEADER LOGO VIDEO
=================================================== */

function setupAfterVideo() {

  const afterVideo =
    document.getElementById(
      'afterVideo'
    );

  const afterVideoImage =
    document.getElementById(
      'afterVideoImage'
    );


  if (!afterVideo) return;


  /* リロード時 */
  if (hasPlayedIntro) {

    if (afterVideoImage) {

      afterVideoImage.classList.add(
        'visible'
      );

    }

    return;

  }


  /* 初回アクセス */
  afterVideo.classList.add(
    'visible'
  );

  afterVideo.play();


  /* 動画終了後に画像へ */
  afterVideo.addEventListener(
    'ended',
    () => {

      afterVideo.classList.remove(
        'visible'
      );

      if (afterVideoImage) {

        afterVideoImage.classList.add(
          'visible'
        );

      }

    },
    {
      once: true
    }
  );

}



function runSetupAfterVideo() {

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      setupAfterVideo,
      {
        once: true
      }
    );

  } else {

    setupAfterVideo();

  }

}



/* ===================================================
   LOADER EFFECT
=================================================== */

if (
  loader &&
  loaderVideo
) {

  if (hasPlayedIntro) {

    loader.style.transition =
      'none';

    loader.classList.add(
      'loaded'
    );

    runSetupAfterVideo();

    if (fadeImage) {

      fadeImage.classList.add(
        'visible'
      );

    }

    if (fadeGif) {

      fadeGif.classList.add(
        'visible'
      );

    }

  } else {

    const fadeBeforeEnd = 1;


    loaderVideo.addEventListener(
      'loadedmetadata',
      () => {

        const duration =
          loaderVideo.duration;

        const fadeStartTime =
          Math.max(
            0,
            duration - fadeBeforeEnd
          );


        loaderVideo.addEventListener(
          'timeupdate',
          function checkTime() {

            if (
              loaderVideo.currentTime >=
              fadeStartTime
            ) {

              loader.classList.add(
                'loaded'
              );

              loaderVideo.removeEventListener(
                'timeupdate',
                checkTime
              );

            }

          }
        );

      }
    );


    /* 6秒後の保険 */
    setTimeout(
      () => {

        loader.classList.add(
          'loaded'
        );

      },
      6000
    );


    /* ローダー終了監視 */
    const loaderObserver =
      new MutationObserver(
        () => {

          if (
            loader.classList.contains(
              'loaded'
            )
          ) {

            if (fadeImage) {

              setTimeout(
                () => {

                  fadeImage.classList.add(
                    'visible'
                  );

                },
                900
              );

            }


            if (fadeGif) {

              setTimeout(
                () => {

                  fadeGif.classList.add(
                    'visible'
                  );

                },
                400
              );

            }


            setTimeout(
              runSetupAfterVideo,
              200
            );


            loaderObserver.disconnect();

          }

        }
      );


    loaderObserver.observe(
      loader,
      {
        attributes: true,
        attributeFilter: ['class']
      }
    );

  }

} else {

  runSetupAfterVideo();

}



/* ===================================================
   BOTTOM BACKGROUND VIDEO
=================================================== */

const bgVideoBtm =
  document.getElementById(
    'bgVideoBtm'
  );

if (bgVideoBtm) {

  const bgVideoObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              bgVideoBtm.classList.add(
                'visible'
              );

              bgVideoBtm.play();

              bgVideoObserver.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.3
      }
    );


  bgVideoObserver.observe(
    bgVideoBtm
  );

}



/* ===================================================
   FIXED CTA
=================================================== */

const fixedCta =
  document.querySelector(
    '.fixed-cta'
  );

const footer =
  document.querySelector(
    '.footer'
  );


if (
  fixedCta &&
  footer
) {

  window.addEventListener(
    'scroll',
    () => {

      const footerRect =
        footer.getBoundingClientRect();

      const windowHeight =
        window.innerHeight;


      if (
        footerRect.top <
        windowHeight
      ) {

        fixedCta.style.bottom =
          (
            windowHeight -
            footerRect.top +
            20
          ) + 'px';

      } else {

        fixedCta.style.bottom =
          '20px';

      }

    }
  );

}