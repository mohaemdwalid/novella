if (!customElements.get("store-locator-slider")) {
  class StoreLocatorSlider extends HTMLElement {
    constructor() {
      super();
      if (Shopify.designMode) {
        window.addEventListener(
          "shopify:section:load",
          this.init.bind(this)
        );
      }
      this.handleResize = this.handleResize.bind(this);
    }

    connectedCallback() {
      this.init();
      window.addEventListener("resize", this.handleResize);
      window.addEventListener("orientationchange", this.handleResize);
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("orientationchange", this.handleResize);
    }

    init() {
      this.hasMapLayout = this.classList.contains("store-locator__map-cards");
      this.updateSwiper();
      this.initTooltips();
    }

    initTooltips() {
      const tooltipTriggers = this.querySelectorAll(".tooltip-trigger");

      tooltipTriggers.forEach(trigger => {
        const content = trigger.nextElementSibling;
        if (!content || !content.classList.contains("tooltip-content")) return;
        if (trigger.dataset.tooltipInitialized) return;
        trigger.dataset.tooltipInitialized = "true";

        const closeButton = content.querySelector(".tooltip-drawer__close");

        if (closeButton) {
          closeButton.addEventListener("click", event => {
            event.stopPropagation();
            this.closeAllTooltips();
          });
        }

        trigger.addEventListener("click", event => {
          event.stopPropagation();
          const wasActive = content.classList.contains("is-active");
          this.closeAllTooltips();
          
          if (!wasActive) {
            content.classList.add("is-active");

            if (DeviceDetector.isMobile()) {
              content.originalParent = content.parentElement;
              content.originalNextSibling = content.nextElementSibling;
              document.body.appendChild(content);
              document.body.classList.add("tooltip-mobile-open");
            }
          }
        });
      });

      this.querySelectorAll(".tooltip-content").forEach(content => {
        content.addEventListener("click", event => event.stopPropagation());
      });

      if (!window.hasTooltipGlobalListener) {
        document.addEventListener("click", this.closeAllTooltips);
        window.hasTooltipGlobalListener = true;
      }
    }

    closeAllTooltips() {
      const activeTooltips = document.querySelectorAll(".tooltip-content.is-active");
      
      activeTooltips.forEach(activeContent => {
        activeContent.classList.remove("is-active");

        if (activeContent.originalParent) {
          activeContent.originalParent.insertBefore(
            activeContent,
            activeContent.originalNextSibling
          );
          delete activeContent.originalParent;
          delete activeContent.originalNextSibling;
        }
      });
      
      document.body.classList.remove("tooltip-mobile-open");
    }

    handleResize() {
      this.updateSwiper();
    }

    updateSwiper() {
      if (this.slider) {
        this.slider.destroy(true, true);
        this.slider = null;
      }

      if (this.hasMapLayout && DeviceDetector.isDesktop()) return;

      const swiperSettings = {};
      
      swiperSettings.spaceBetween = parseInt(this.dataset.spaceBetween) || 12;
      swiperSettings.slidesPerView = 1;
      
      swiperSettings.navigation = {
        prevEl: `.swiper-button--prev-${this.dataset.sectionId}`,
        nextEl: `.swiper-button--next-${this.dataset.sectionId}`
      };

      if (!this.hasMapLayout) {
        swiperSettings.breakpoints = {
          360: { slidesPerView: 1.08 },
          750: { slidesPerView: 2 },
          1200: { slidesPerView: (parseInt(this.dataset.slidesPerView) * 1.02) || 2 }
        };
      }

      this.slider = new Swiper(this, swiperSettings);

      this.slider.on("slideChange transitionEnd", () => {
        const slides = this.querySelectorAll(".store-locator-card.swiper-slide");
        slides.forEach((slide) => {
          slide.style.display = "block";
        });
      });
    }
  }

  customElements.define("store-locator-slider", StoreLocatorSlider);
}
