if (!customElements.get('card-product-slider')) {
  class CardProductSlider extends HTMLElement {
    constructor() {
      super();

      const swiperOpts = JSON.parse(this.getAttribute('data-swiper-options')) || {};
      const {
        spaceBetweenMobile = 2,
        slidesPerViewMobile = 'auto',
        spaceBetweenDesktop = 2,
        navigation,
        autoplay,
        loop
      } = swiperOpts;

      this.sliderWrapper = this.querySelector('.swiper-wrapper');
      this.requiresFetch = this.hasAttribute('data-url');
      this.parent = this.closest('[data-section-id]');
      
      this.sliderOptions = {
        a11y: false,
        threshold: 3,
        resistanceRatio: 0.72,
        spaceBetween: spaceBetweenMobile,
        slidesPerView: slidesPerViewMobile,
        breakpoints: {
          750: {
            slidesPerView: 3,
            spaceBetween: spaceBetweenDesktop
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: spaceBetweenDesktop
          }
        }
      };

      if (navigation) this.sliderOptions.navigation = { ...navigation };
      if (autoplay) this.sliderOptions.autoplay = { ...autoplay };
      if (loop) this.sliderOptions.loop = loop;
    }

    connectedCallback() {
      if (this.requiresFetch) {
        this.fetchItems();
        return;
      }
      this.initSlider();
      this.syncHeights();
      window.addEventListener("resize", () => this.syncHeights());
    }

    syncHeights() {
      const textSlide = this.querySelector('.products-feed__card-text-custom-slide');
      const actionElement = this.querySelector('.product-card__actions');

      if (textSlide && actionElement) {
        const actionHeight = actionElement.offsetHeight;
        textSlide.style.height = `${actionHeight}px`;
      }
    }

    async fetchItems() {
      if (!this.parent) throw new Error('Parent is missing');
      
      try {
        const response = await fetch(this.getAttribute('data-url'));
        const htmlText = await response.text();
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const swiperWrapper = doc.querySelector('.swiper-wrapper');

        if (swiperWrapper && swiperWrapper.innerHTML.trim().length > 0) {
          this.querySelector('.swiper-wrapper').innerHTML = swiperWrapper.innerHTML;
          this.parent.classList.remove('hidden');
          this.initSlider();
        }
      } catch (error) {
        console.error(error);
      }
    }

    initSlider(slider = this) {
      this.slider = new Swiper(slider, this.sliderOptions);

      this.slider.wrapperEl.setAttribute('aria-live', 'polite');
      this.slider.wrapperEl.id = `swiper-wrapper-${this.dataset.sectionId}`;
      this.slider.slides.forEach((slide, i) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute(
          'aria-label',
          `${i + 1} / ${this.slider.slides.length}`
        );
        slide.dataset.index = i;
      });

      if (this.swiperOptions?.navigation) {
        const sliderButtons = [
          this.slider.navigation.prevEl,
          this.slider.navigation.nextEl
        ];

        sliderButtons.forEach((button, i) => {
          let type = 'Previous';

          if (i === 1) {
            type = 'Next';
          }

          button.setAttribute('aria-label', `${type} slide`);
          button.setAttribute(
            'aria-controls',
            this.slider.wrapperEl.id
          );
        });
      }

      this.slider.wrapperEl.addEventListener('focusin', e => {
        this.slider.el.scrollLeft = 0;

        const slide = e.target.closest('.swiper-slide');
        const slideIndex = +slide.dataset.index;
        const isFirstSlide = slideIndex === 0;
        const isLastSlide =
          slideIndex === this.slider.slides.length - 1;

        if (isFirstSlide || isLastSlide) {
          this.slider.slideTo(slideIndex, 0);

          return;
        }

        const slideRect = slide.getBoundingClientRect();
        const wrapperWidth = this.slider.wrapperEl.clientWidth;
        // prettier-ignore
        const slideLeft = slideRect.x + slideRect.width - ((document.body.clientWidth - wrapperWidth) / 2);
        const isSlideVisible =
          slideLeft <= wrapperWidth && slideLeft >= slideRect.width;

        if (isSlideVisible) {
          return;
        }

        slideLeft >= slideRect.width
          ? this.slider.slideNext(0)
          : this.slider.slidePrev(0);
      });

      const swiperOptions = JSON.parse(this.getAttribute('data-swiper-options')) || {};
      /** stop / start autoplay on hover if quick cart is not open */
      this.slider.wrapperEl.addEventListener('mouseenter', () =>
        this.slider.autoplay.stop()
      );
      this.slider.wrapperEl.addEventListener('mouseleave', () => {
        if (!this.classList.contains('product--open-on-quick-cart') && this.sliderOptions.autoplay) {
          this.slider.autoplay.start();
        }
        if (swiperOptions.autoplay === false) {
          this.slider.autoplay.stop();
        }
      });

      if (
        this.hasAttribute('data-init-quick-cart') &&
        document.querySelector('quick-cart-drawer') &&
        this.querySelector('.swiper-slide')
      ) {
        document.querySelector('quick-cart-drawer').init();
      }

      this.querySelectorAll('product-card').forEach(card => {
        card.init();
      });

      if (Shopify.designMode) {
        if (
          this.hasAttribute('data-init-quick-cart') &&
          document.querySelector('quick-cart-drawer') &&
          this.querySelector('.swiper-slide')
        ) {
          document.querySelector('quick-cart-drawer').init();
        }
      }
    }
  }

  customElements.define('card-product-slider', CardProductSlider);
}
