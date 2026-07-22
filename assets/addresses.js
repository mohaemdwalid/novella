class CustomerCountrySelect extends DropdownInput {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupCountries();
    this.init();
  }

  setupCountries() {
    if (!Shopify || !Shopify.CountryProvinceSelector) return;

    const formId = this.select.dataset.formId;
    
    let countryElement = 'AddressCountry_new';
    let provinceElement = 'AddressProvince_new';
    let containerElement = 'AddressProvinceContainer_new';

    if (formId) {
      countryElement = `AddressCountry_${formId}`;
      provinceElement = `AddressProvince_${formId}`;
      containerElement = `AddressProvinceContainer_${formId}`;
    }

    // eslint-disable-next-line no-new
    new Shopify.CountryProvinceSelector(countryElement, provinceElement, {
      hideElement: containerElement
    });

    this.select.addEventListener('change', () => {
      const provinceSelector = document.querySelector(`#${containerElement} customer-country-select`);
      if (provinceSelector) {
        provinceSelector.update();
      }
    });
  }
}

customElements.define(
  'customer-country-select',
  CustomerCountrySelect
);

class CustomerAddresses {
  constructor() {
    this.selectors = {
      customerAddresses: '[data-addresses-wrapper]',
      toggleAddressButton: 'button[data-form-id]',
      deleteAddressButton: 'button[data-confirm-message]'
    };
    this.attributes = {
      confirmMessage: 'data-confirm-message'
    };
    
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    
    this._setupEventListeners();
  }

  _getElements() {
    const container = document.querySelector(this.selectors.customerAddresses);
    
    if (!container) {
      return {};
    }

    return {
      container,
      toggleButtons: document.querySelectorAll(this.selectors.toggleAddressButton),
      deleteButtons: container.querySelectorAll(this.selectors.deleteAddressButton)
    };
  }

  _toggleExpanded(target) {
    const targetForm = document.querySelector(`#${target.dataset.formId}`);
    if (targetForm) {
      targetForm.classList.toggle('hidden');
    }
    this.elements.container.classList.toggle('hidden');
  }

  _handleToggleButtonsClick = (event) => {
    this._toggleExpanded(event.currentTarget);
  };

  _handleDeleteButtonClick = (event) => {
    const target = event.currentTarget;
    const confirmMessage = target.getAttribute(this.attributes.confirmMessage);

    // eslint-disable-next-line no-alert
    if (confirm(confirmMessage)) {
      Shopify.postLink(target.dataset.target, {
        parameters: { _method: 'delete' }
      });
    }
  };

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleToggleButtonsClick);
    });
    
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }
}
