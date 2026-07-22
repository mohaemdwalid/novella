(function() {
  const loadMoreBtn = document.querySelector('.js-btn-load-more');
  if (!loadMoreBtn) return;

  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      loadMoreBtn.click();
    }
  }).observe(loadMoreBtn);
})();
