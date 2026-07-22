if (!customElements.get('recently-viewed-products')) {
  class RecentlyViewed extends customElements.get('card-product-slider') {
    constructor() {
      super();

      this.section = this.closest('.js-section');
      this.sliderWrapper = this.querySelector('.swiper-wrapper');
      this.productHandle = this.dataset.productHandle;

      this.fetchRecentProducts();

      const quickCartDrawer = document.querySelector('quick-cart-drawer');
      const hasSwiperSlide = this.querySelector('.swiper-slide');

      if (quickCartDrawer && hasSwiperSlide) {
        quickCartDrawer.init();
      }

      if (Shopify.designMode && quickCartDrawer && hasSwiperSlide) {
        quickCartDrawer.init();
      }
    }

    fetchRecentProducts() {
      const shopifyRoot = window.Shopify?.routes?.root;
      
      if (!shopifyRoot) {
        setTimeout(() => this.fetchRecentProducts(), 100);
        return;
      }

      const storedHandles = localStorage.getItem('recently-viewed');
      if (!storedHandles) return;

      const handlesToFetch = storedHandles
        .split(',')
        .filter(handle => handle && handle !== this.productHandle && handle !== 'undefined');

      if (!handlesToFetch.length) return;

      handlesToFetch.forEach(async (handle, index) => {
        try {
          const cardRes = await fetch(`${shopifyRoot}products/${handle}?view=card`);

          if (!cardRes.ok) {
            const currentStored = localStorage.getItem('recently-viewed') || '';
            const cleanedStored = currentStored.replace(`${handle},`, '').replace(handle, '');
            localStorage.setItem('recently-viewed', cleanedStored);
            return;
          }

          const cardHtml = await cardRes.text();
          const slideDiv = document.createElement('div');

          slideDiv.classList.add('swiper-slide', 'card-product-slider__slide');
          slideDiv.insertAdjacentHTML('beforeend', cardHtml);
          
          const hasProductCard = slideDiv.querySelector('product-card');
          const hasProductCardClass = slideDiv.querySelector('.product-card');
          if (!hasProductCard || !hasProductCardClass) return;

          this.sliderWrapper.append(slideDiv);
        } catch (err) {
          // ignore error
        } finally {
          if (index === handlesToFetch.length - 1) {
            this.initSlider();
            this.section?.classList.remove('hidden');
          }
        }
      });
    }
  }

  customElements.define('recently-viewed-products', RecentlyViewed);
}
