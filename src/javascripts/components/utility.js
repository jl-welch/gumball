/**
 * Callback to execute for each array element in loop.
 *
 * @callback eachCallback
 * @param {*} element The current element being processed in array
 * @param {number} index The index of the current element
 */

/**
 * Loop through an array and execute a callback for each element.
 *
 * @param {Array} array The array to loop over
 * @param {eachCallback} callback The callback function to exectue
 */
const each = (array, callback) => {
  for (let i = 0; i < array.length; i += 1) {
    const response = callback(array[i], i);
    if (response) break;
  }
};

/**
 * Get an elements selector from 'target' containing data-target or href.
 *
 * @param {HTMLElement} element The element target to get selector from
 * @returns {string|null}
 */
const getSelectorFromTarget = element => {
  let selector = element.getAttribute("data-target");

  if (!selector || selector === "#") {
    const hrefAttr = element.getAttribute("href");

    selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
  }

  return document.querySelector(selector) ? selector : null;
};

/**
 * Get list of all elements that toggle a single element.
 *
 * @param {HTMLElement} element Element which is being toggled
 * @param {string} dataAttr Data target attribute for targeting element
 */
const getToggleList = (element, dataAttr) => {
  // DEVTODO - Check for elements toggling with href
  const toggleElements = document.querySelectorAll(dataAttr);
  const toggleList = [];

  each(toggleElements, toggleElement => {
    const selector = getSelectorFromTarget(toggleElement);
    if (!selector) return;

    const filteredList = Array.from(
      document.querySelectorAll(selector)
    ).filter(el => el === element);

    if (filteredList.length) toggleList.push(toggleElement);
  });

  return toggleList.length ? toggleList : null;
};

/**
 * Check for valid HTML element.
 *
 * @param {HTMLElement} element Element to check
 */
const isElement = element => (element[0] || element).nodeType;

/**
 * Force reflow to recalculate element height before transitioning.
 *
 * @param {*} element Element to get offsetHeight, forcing reflow
 */
const reflow = element => element.offsetHeight;

export {
  getToggleList,
  getSelectorFromTarget,
  each,
  isElement,
  reflow,
};
