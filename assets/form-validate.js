if (!customElements.get('form-validate')) {
  class FormValidation extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
      if (!this.form) throw new Error('Form element does not exist');
    }

    connectedCallback() {
      this.setHandlers();
    }

    setHandlers() {
      const events = ['input', 'blur', 'change', 'invalid'];
      
      this.form.addEventListener('submit', (e) => this.onSubmit(e));
      
      for (const input of this.form.elements) {
        if (input.hasAttribute('data-no-validate')) continue;

        for (const eventName of events) {
          input.addEventListener(eventName, (e) => this.setInputHandler(e));
        }
      }
    }

    onSubmit(event) {
      if (!this.form.reportValidity()) event.preventDefault();
      this.form.submit();
    }

    setInputHandler(event) {
      if (event.type === 'invalid') {
        event.preventDefault();
      }
      this.setFieldValidity(event.target);
    }

    setFieldValidity(input) {
      const isValid = input.validity.valid;
      input.setAttribute('aria-invalid', !isValid);
      
      const field = input.closest('[data-input-wrapper]');
      if (!field) return;
      
      field.classList.toggle('has-error', !isValid);
      this.toggleErrorMessage(input, field);
    }

    toggleErrorMessage(input, field) {
      const errorMessageWrapper = field.querySelector('[data-message]');
      const isValid = input.validity.valid;
      
      errorMessageWrapper.classList.toggle('hidden', isValid);
      errorMessageWrapper.parentElement.classList.toggle('has-error', !isValid);

      if (input.type === 'email') {
        errorMessageWrapper.innerHTML = window.validationStrings.invalidEmail;
      } else {
        errorMessageWrapper.innerHTML = input.validationMessage;
      }
    }
  }

  customElements.define('form-validate', FormValidation);
}
