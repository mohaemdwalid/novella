if (!customElements.get("card-slider")) {
  class CardSlider extends HTMLElement {
    constructor() {
      super();

      const configParams = JSON.parse(this.getAttribute("data-swiper-options")) || {};

      window.addEventListener("shopify:section:load", () => {
        this.initSlider(configParams);
      });

      this.initSlider(configParams);

      if (this.classList.contains("js-testimonials")) {
        const handleTestimonialResize = () => {
          const hasSlideEffect = this.slider && this.slider.params.effect === "slide";
          const isMobile = DeviceDetector.isMobile();
          if ((isMobile && !hasSlideEffect) || (!isMobile && hasSlideEffect)) {
            this.reInitSlider(configParams);
          }
        };

        handleTestimonialResize();
        window.addEventListener("resize", handleTestimonialResize);
      }

      // if window is resized, re-init slider
      window.addEventListener("resize", () => {
        if (configParams.disabledOnMobile && DeviceDetector.isMobile()) {
          if (this.slider) {
            this.slider.destroy();
          }
        } else if (!this.slider) {
          this.initSlider(configParams);
        }
      });
    }

    reInitSlider(configParams) {
      this.slider.destroy();
      this.initSlider(configParams);
    }

    initSlider(settings) {
      const circleElem = document.querySelector(`.autoplay-progress--${settings.sectionId} svg`);
      const textElem = document.querySelector(`.autoplay-progress--${settings.sectionId} span`);

      if (settings.disabledOnMobile && DeviceDetector.isMobile()) {
        return;
      }

      switch (settings.pagination) {
        case "render_bullet":
          settings.pagination = {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: (idx, cls) => `
              <button class="${cls}">
                <span>${idx + 1}</span>
              </button>
            `
          };
          break;
        case "progressbar":
          settings.pagination = { el: ".swiper-pagination", type: "progressbar" };
          break;
        case "bullets":
          settings.pagination = { el: ".swiper-pagination", clickable: true };
          break;
        default:
          settings.pagination = false;
          break;
      }

      if (settings.loop && settings.slideCount < 2) {
        settings.loop = false;
      }

      const defaultNav = { nextEl: ".swiper-button--next", prevEl: ".swiper-button--prev" };

      let swiperConfig = {
        slidesPerView: settings.slidesPerView || 1.1,
        spaceBetween: settings.spaceBetweenMobile ?? 16,
        resistanceRatio: 0.72,
        navigation: settings.navigation || defaultNav,
        breakpoints: {
          480: {
            slidesPerView: "auto",
            spaceBetween: settings.spaceBetweenMobile || 2
          },
          750: {
            slidesPerView: settings.slidesPerViewDesktop || 3,
            spaceBetween: settings.spaceBetweenDesktop ?? 16
          }
        }
      };

      const hasArticles = this.classList.contains("js-articles");
      const hasCollections = this.classList.contains("js-collections");
      const hasFeatured = this.classList.contains("js-featured-products");

      const autoplayHandler = {
        autoplayTimeLeft(_s, time, progress) {
          if (circleElem) circleElem.style.setProperty("--progress", 1 - progress);
          if (textElem) textElem.textContent = `${Math.ceil(time / 1000)}s`;
        }
      };

      switch (true) {
        case hasArticles || hasCollections || hasFeatured:
          swiperConfig.breakpoints[575] = { slidesPerView: 2 };
          break;

        case this.classList.contains("horizontal-w-media"):
          swiperConfig = {
            slidesPerView: settings.slidesPerView || 1.1,
            rewind: settings.rewind || false,
            followFinger: settings.followFinger || false,
            spaceBetween: settings.spaceBetweenMobile || 16,
            pagination: settings.pagination || false,
            navigation: settings.navigation || defaultNav,
            loop: settings.loop || false,
            autoplay: settings.autoplay || false,
            breakpoints: {
              750: {
                slidesPerView: 2.2,
                spaceBetween: settings.spaceBetweenDesktop || 16
              },
              990: { slidesPerView: 1 }
            },
            on: autoplayHandler
          };
          break;

        case this.classList.contains("vertical-w-media"):
          if (!DeviceDetector.isMobile()) {
            const bulletRenderer = (idx, cls) => `<button class="${cls}"><span>${idx + 1}</span></button>`;
            swiperConfig = {
              slidesPerView: settings.slidesPerView || 1.1,
              rewind: settings.rewind || false,
              followFinger: settings.followFinger || false,
              spaceBetween: settings.spaceBetweenMobile || 16,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: bulletRenderer
              },
              navigation: settings.navigation || defaultNav,
              loop: settings.loop || false,
              autoplay: settings.autoplay || false,
              breakpoints: {
                750: {
                  slidesPerView: 2.2,
                  spaceBetween: settings.spaceBetweenDesktop || 16,
                  pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    renderBullet: bulletRenderer
                  }
                },
                990: {
                  slidesPerView: 1,
                  grid: { rows: 3 }
                }
              }
            };
          } else {
            swiperConfig = {
              slidesPerView: settings.slidesPerView || 1.1,
              rewind: settings.rewind || false,
              followFinger: settings.followFinger || false,
              spaceBetween: settings.spaceBetweenMobile || 16,
              navigation: settings.navigation || defaultNav,
              loop: settings.loop || false,
              autoplay: settings.autoplay || false,
              on: autoplayHandler
            };
          }
          break;

        case this.classList.contains("carousel-none-media"):
          swiperConfig = {
            slidesPerView: settings.slidesPerView || 1.1,
            rewind: settings.rewind || false,
            followFinger: settings.followFinger || false,
            spaceBetween: settings.spaceBetweenMobile || 16,
            pagination: settings.pagination || false,
            navigation: settings.navigation || defaultNav,
            loop: settings.loop || false,
            autoplay: settings.autoplay || false,
            breakpoints: {
              750: {
                slidesPerView: 2.2,
                spaceBetween: settings.spaceBetweenDesktop || 16
              },
              990: { slidesPerView: 3.2 }
            },
            on: autoplayHandler
          };
          break;

        default:
          swiperConfig = {
            effect: "fade",
            slidesPerView: 1,
            rewind: true,
            followFinger: false,
            navigation: defaultNav
          };
          break;
      }

      this.slider = new Swiper(this, swiperConfig);
    }
  }

  customElements.define("card-slider", CardSlider);
}
