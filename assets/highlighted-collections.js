if (!customElements.get('highlighted-collections')) {
  class HighlightedCollections extends HTMLElement {
    constructor() {
      super();

      if (Shopify.designMode) {
        window.addEventListener('shopify:section:load', () => {
          this.init();
        });
      }
      if (DeviceDetector.isDesktop()) {
        this.init();
      }
    }

    init() {
      this.displayImages();
    }

    displayImages() {
      const collectionItems = this.querySelectorAll('.highlighted__collections-item-box');
      const collectionImages = this.querySelectorAll('.highlighted__collections-image');

      collectionItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          collectionItems.forEach(el => el.classList.remove('highlighted__collections-active'));
          collectionImages.forEach(img => img.classList.remove("highlighted-img--active"));

          const imageId = item.getAttribute('data-image');
          const targetImg = this.querySelector(`[data-hover="image-${imageId}"]`);

          if (targetImg) {
            targetImg.classList.add('highlighted-img--active');
          }
        });
      });
    }
  }

  customElements.define('highlighted-collections', HighlightedCollections);
}
