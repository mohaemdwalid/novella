/**
 * Set cookie.
 * @param {String} name
 * @param {String} value
 * @param {Number} days
 * @returns Void
 */
const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 86400000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

/**
 * Get cookie data.
 * @param {String} name
 * @returns {String|Null}|
 */
const getCookie = name => {
  const searchString = `${name}=`;
  const foundCookie = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(searchString));
    
  return foundCookie ? foundCookie.substring(searchString.length) : null;
};

/**
 * Erase cookie value
 * @param {String} name
 */
const eraseCookie = name => {
  document.cookie = `${name}=; Max-Age=-99999999`;
};
