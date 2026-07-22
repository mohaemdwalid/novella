if (!customElements.get("product-asseenon-slider")) {
  class ProductAsSeenOnSlider extends HTMLElement {
    constructor() {
      super();
      if (Shopify.designMode) {
        window.addEventListener(
          "shopify:section:load",
          this.init.bind(this)
        );
      }
    }

    connectedCallback() {
      this.init();
    }

    init() {
      const swiperConfig = {
        centeredSlides: true,
        loop: false,
        slidesPerView: "auto",
        navigation: {
          prevEl: ".swiper-button--prev",
          nextEl: ".swiper-button--next"
        },
        on: {
          activeIndexChange: swiper => {
            const indexNode = this.querySelector("[data-asseenon-media-counter-index]");
            if (indexNode) indexNode.textContent = swiper.activeIndex + 1;
          }
        }
      };
      this.slider = new Swiper(this, swiperConfig);
    }
  }

  customElements.define(
    "product-asseenon-slider",
    ProductAsSeenOnSlider
  );
}
