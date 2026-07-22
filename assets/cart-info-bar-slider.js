if (!customElements.get('cart-drawer-info-slider')) {
  class CartDrawerInfoSlider extends HTMLElement {
    constructor() {
      super();

      if (Shopify.designMode) {
        window.addEventListener('shopify:section:load', () => this.init());
      }
      
      this.init();
    }

    init() {
      const swiperContainer = document.querySelector('.cart-drawer__swiper');

      this.slider = new Swiper(swiperContainer, {
        direction: 'vertical',
        slidesPerView: 1,
        loop: true,
        allowTouchMove: false,
        autoplay: { delay: 5000 }
      });
    }
  }

  customElements.define('cart-drawer-info-slider', CartDrawerInfoSlider);
}
