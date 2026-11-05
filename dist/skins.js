(() => {
  const intro = document.createElement('section');
  intro.className = 'skin-intro'; intro.setAttribute('aria-label','工作台寄语');
  document.querySelector('.desk-nav').before(intro);
  const render = () => {
    const isWalk = document.body.dataset.theme === 'stroll';
    intro.innerHTML = isWalk
      ? '<div><div class="intro-kicker">A little room for everyday life</div><h2 class="intro-title">日子慢慢，<em>一步一步。</em></h2><p class="intro-note">今天的事，就从一件开始。也留一点空，给喜欢的生活。</p></div><div class="intro-stamp"><span>A NOTE TO MYSELF</span><strong>今日小记</strong><span>TAKE YOUR TIME<br>ENJOY THE ORDINARY</span></div>'
      : '<div><div class="intro-kicker">A letter to my everyday self / 写给日常</div><h2 class="intro-title">Day by day.<em>yours, always</em></h2><p class="intro-note">Small steps, lovely days. / 好好度过，属于自己的一天。</p></div><div class="intro-stamp"><span>COLLECTION / 01</span><strong>Dear me,</strong><span>MAKE ROOM<br>FOR LITTLE JOYS</span></div>';
  };
  new MutationObserver(render).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  render();
})();
