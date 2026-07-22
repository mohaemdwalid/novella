class PickupAvailability extends HTMLElement {
  constructor() {
    super();

    if (!this.hasAttribute('available')) return;

    const template = this.querySelector('template');
    this.errorHtml = template.content.firstElementChild.cloneNode(true);
    
    this.onClickRefreshList = this.onClickRefreshList.bind(this);
    this.fetchAvailability(this.dataset.variantId);
  }

  async fetchAvailability(variantId) {
    let { rootUrl } = this.dataset;
    if (!rootUrl.endsWith('/')) {
      rootUrl += '/';
    }

    const fetchUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

    try {
      const response = await fetch(fetchUrl);
      const htmlText = await response.text();
      const dom = new DOMParser().parseFromString(htmlText, 'text/html');
      this.renderPreview(dom.querySelector('.shopify-section'));
    } catch (error) {
      const btn = this.querySelector('button');
      if (btn) btn.removeEventListener('click', this.onClickRefreshList);
      
      this.renderError();
    }
  }

  onClickRefreshList(event) {
    this.fetchAvailability(this.dataset.variantId);
  }

  renderError() {
    this.innerHTML = '';
    this.appendChild(this.errorHtml);
    
    const retryBtn = this.querySelector('button');
    if (retryBtn) {
      retryBtn.addEventListener('click', this.onClickRefreshList);
    }
  }

  renderPreview(sectionInnerHTML) {
    const preview = sectionInnerHTML.querySelector('pickup-availability-preview');

    if (!preview) {
      this.innerHTML = '';
      this.removeAttribute('available');
      return;
    }

    this.innerHTML = preview.outerHTML;
    this.setAttribute('available', '');
  }
}

customElements.define('pickup-availability', PickupAvailability);
