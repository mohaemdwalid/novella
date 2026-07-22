if (!customElements.get('custom-select')) {
  class CustomSelect extends HTMLElement {
    constructor() {
      super();

      this.selectEl = this.querySelector('select');
      this.createCustomSelect();

      this.dropdown = this.querySelector('.js-dropdown');
      this.btnToggleDropdown = this.querySelector('.js-btn-dropdown');
      this.listOptions = this.querySelector('.js-list-options');
      this.isExpanded = false;
      this.selectLabel = this.getAttribute('data-label');

      this._bindEvents();
    }

    _bindEvents() {
      this._handleSectionLoad = this._handleSectionLoad.bind(this);
      this._handleResize = this._handleResize.bind(this);
      this._handleToggleClick = this._handleToggleClick.bind(this);
      this._handleToggleKeyDown = this._handleToggleKeyDown.bind(this);
      this._handleListOptionsClick = this._handleListOptionsClick.bind(this);
      this._handleDocumentClick = this._handleDocumentClick.bind(this);

      window.addEventListener('shopify:section:load', this._handleSectionLoad);
      window.addEventListener('resize', this._handleResize);
      this.btnToggleDropdown.addEventListener('click', this._handleToggleClick);
      this.btnToggleDropdown.addEventListener('keydown', this._handleToggleKeyDown);
      this.listOptions.addEventListener('click', this._handleListOptionsClick);
      document.addEventListener('click', this._handleDocumentClick);
    }

    _handleSectionLoad() {
      clearTimeout(this.loadTimeout);
    }

    _handleResize() {
      if (DeviceDetector.isMobile()) return;

      const currentWidth = +this.btnToggleDropdown.style.width.replace('px', '');
      if (currentWidth === this.dropdown.clientWidth) return;

      this.btnToggleDropdown.style.width = `${this.dropdown.clientWidth}px`;
    }

    _handleToggleClick(e) {
      e.preventDefault();
      this.classList.contains('is-expanded') ? this.hideDropdown() : this.showDropdown();
    }

    _handleToggleKeyDown(e) {
      if (e.key.includes('Arrow')) {
        e.preventDefault();
        const isArrowRight = e.key.includes('Right');
        const isNextKey = isArrowRight || e.key.includes('Down');

        if (this.isExpanded && (e.key.includes('Left') || isArrowRight)) return;

        const btnOptionSelected = this.listOptions.querySelector('.js-btn-option.is-selected');
        const parent = btnOptionSelected.parentElement;
        
        let targetBtn = isNextKey 
          ? parent.nextElementSibling?.firstElementChild 
          : parent.previousElementSibling?.firstElementChild;

        if (!targetBtn) {
          targetBtn = isNextKey 
            ? this.listOptions.firstElementChild.firstElementChild 
            : this.listOptions.lastElementChild.firstElementChild;
        }

        this.changeSelectedOption(btnOptionSelected, targetBtn);
        return;
      }

      if (this.isExpanded && (e.key === 'Escape' || e.key === 'Tab')) {
        e.preventDefault();
        this.hideDropdown();
      }
    }

    _handleListOptionsClick(e) {
      const btn = e.target;
      if (!btn.classList.contains('js-btn-option')) return;

      e.preventDefault();
      this.hideDropdown();

      if (!btn.classList.contains('is-selected')) {
        this.changeSelectedOption(undefined, btn);
      }
    }

    _handleDocumentClick(e) {
      if (this.isExpanded && e.target.closest('custom-select') !== this) {
        this.hideDropdown();
      }
    }

    createCustomSelect() {
      const options = Array.from(this.querySelectorAll('option'));
      const selectedOption = this.selectEl.querySelector('option[selected="selected"]');

      const optionsMarkup = options.map(option => `
        <li class="custom-select__item">
          <button
            type="button"
            class="custom-select__option button-reset js-btn-option ${option.selected ? 'is-selected' : ''}"
            data-value="${option.value}"
            tabindex="-1"
            aria-selected="${option.selected}"
          >${option.textContent}</button>
        </li>
      `).join('');

      const markup = `
        <div class="custom-select__wrapper">
          <button
            type="button"
            class="custom-select__btn button-reset focus-inset js-btn-dropdown facets__button-custom"
            aria-controls="${this.dataset.dropdownId}"
            aria-expanded="false"
          >
            ${selectedOption.textContent} ${this.dataset.iconChevronDown}
          </button>
          <div class="custom-select__dropdown js-dropdown" id="${this.dataset.dropdownId}">
            <ul class="custom-select__items list-unstyled js-list-options">
              ${optionsMarkup}
            </ul>
          </div>
        </div>
      `;

      this.insertAdjacentHTML('afterbegin', markup);
      this.dataset.value = selectedOption.value;
    }

    changeSelectedOption(selectedOption = this.listOptions.querySelector('.js-btn-option.is-selected'), newSelectedOption) {
      this.btnToggleDropdown.innerHTML = newSelectedOption.textContent + this.dataset.iconChevronDown;
      this.dataset.value = newSelectedOption.dataset.value;

      newSelectedOption.classList.add('is-selected');
      newSelectedOption.setAttribute('aria-selected', true);

      selectedOption.classList.remove('is-selected');
      selectedOption.setAttribute('aria-selected', false);

      this.selectEl.querySelector('option[selected="selected"]').removeAttribute('selected');
      this.selectEl.querySelector(`option[value="${this.dataset.value}"]`).setAttribute('selected', 'selected');

      this.selectEl.dispatchEvent(new Event('input', { bubbles: true }));
    }

    showDropdown() {
      this.isExpanded = true;
      this.classList.add('is-expanded');
      this.btnToggleDropdown.setAttribute('aria-expanded', true);
    }

    hideDropdown() {
      this.isExpanded = false;
      this.classList.remove('is-expanded');
      this.btnToggleDropdown.setAttribute('aria-expanded', false);
    }
  }

  customElements.define('custom-select', CustomSelect);
}
