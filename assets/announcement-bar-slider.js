if (!customElements.get('announcement-bar-slider')) {
  class AnnouncementBarSlider extends HTMLElement {
    constructor() {
      super();

      const swiperOptions = JSON.parse(this.getAttribute('data-swiper-options')) || {};

      this.initSlider(swiperOptions);

      window.addEventListener('shopify:section:load', e => {
        this.initSlider(swiperOptions);
      });
    }

    initSlider(options) {
      const config = {
        slidesPerView: options.slidesPerView || 1,
        resistanceRatio: 0.72,
        loop: options.loop || false,
        allowTouchMove: options.allowTouchMove !== false,
        autoplay: options.autoplay || false,
        breakpoints: {
          750: {
            slidesPerView: options.slidesPerViewDesktop || 'auto',
            loop: options.loopDesktop || options.loop || false,
          }
        }
      };

      this.slider = new Swiper(this, config);
    }
  }

  customElements.define('announcement-bar-slider', AnnouncementBarSlider);
}
