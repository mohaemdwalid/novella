(() => {
  if (customElements.get('complementary-products')) {
    return;
  }

  class ComplementaryProducts extends customElements.get(
    'card-product-slider'
  ) {
    constructor() {
      super();

      const swiperOptions = JSON.parse(this.getAttribute('data-swiper-options')) || {};

      this.sliderOptions = {
        slidesPerView: 1,
        spaceBetween: swiperOptions.spaceBetweenMobile || 2,
        breakpoints: {
          990: {
            spaceBetween: swiperOptions.spaceBetweenDesktop || 2,
            slidesPerView: swiperOptions.slidesPerViewDesktop || 2,
            slidesPerGroup: 2
          }
        }
      };
    }

    initSlider() {
      super.initSlider();
      this.parentElement.classList.remove('hidden');

      const quickCart = document.querySelector("quick-cart-drawer");
      if (quickCart) {
        quickCart.init();
      }

      // Design mode fallback
      if (Shopify.designMode && quickCart) {
        quickCart.init();
      }
    }
  }

  customElements.define(
    'complementary-products',
    ComplementaryProducts
  );
})();
