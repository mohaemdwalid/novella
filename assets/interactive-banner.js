if (window.Shopify && window.Shopify.designMode) {
  window.addEventListener('shopify:block:select', (evt) => {
    document.querySelectorAll('.section-interactive-banner .section-interactive-banner__element.active')
      .forEach(activeNode => activeNode.classList.remove('active'));
      
    const blockIdentifier = evt.detail.blockId;
    const targetMedia = document.querySelector(`.section-interactive-banner__media-element-${blockIdentifier}`);
    const targetLink = document.querySelector(`.section-interactive-banner__element[data-hover-target='.section-interactive-banner__media-element-${blockIdentifier}']`);
    
    if (targetLink) targetLink.classList.add("active");
    if (targetMedia) targetMedia.classList.add("active");
  });
}


(() => {
  const setupBannerElements = () => {
    const bannerItems = document.querySelectorAll(".section-interactive-banner__element");
    bannerItems.forEach(bannerItem => {
      const contentText = bannerItem.innerText;
      bannerItem.innerHTML = "";

      const divBlock = document.createElement("div");
      divBlock.classList.add("block");

      const spanWord = document.createElement("span");
      spanWord.innerText = contentText.trim() === "" ? "\xa0" : contentText;
      spanWord.classList.add("word");
      divBlock.appendChild(spanWord);

      bannerItem.appendChild(divBlock);
      bannerItem.appendChild(divBlock.cloneNode(true));

      const firstChildBlock = bannerItem.querySelector(".block");
      if (firstChildBlock) {
        bannerItem.style.setProperty(
          "--interactive-banner-element-height",
          `${firstChildBlock.getBoundingClientRect().height}px`
        );
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", setupBannerElements);
  } else {
    setupBannerElements();
  }
})();
