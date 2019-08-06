// polyfill
import { selectorMatches } from "../polyfill";

/**
 * Run-of-the-mill for loop wrapped up.
 * Allow to return "break" to break out of loop early.
 */
const each = (array, callback) => {
  for (let i = 0; i < array.length; i += 1) {
    const response = callback(array[i], i);

    if (response === "break") {
      break;
    }
  }
};

/**
 * Create array, useful for converting nodeList to array.
 */
const makeArray = nodeList => {
  if (!nodeList) {
    return [];
  }

  return [].slice.call(nodeList);
};

/**
 * Return target string from data-target or href attribute.
 */
const getSelectorFromTarget = element => {
  let selector = element.getAttribute("data-target");

  if (!selector) {
    const hrefAttr = element.getAttribute("href");

    selector = hrefAttr && hrefAttr !== "#" ? hrefAttr : null;
  }

  return document.querySelector(selector) ? selector : null;
};

/**
 * Find 'togglers' which contain the data attribute parameter.
 * Add 'toggler' to array if they point to the element parameter.
 * Return array if not empty.
 */
const getToggleList = (element, dataAttr) => {
  const toggleElements = document.querySelectorAll(dataAttr);
  const toggleList = [];

  each(toggleElements, toggleElement => {
    const selector = getSelectorFromTarget(toggleElement);
    if (!selector) {
      return;
    }

    const match = selectorMatches(element, selector);

    if (match) {
      toggleList.push(toggleElement);
    }
  });

  return toggleList.length ? toggleList : null;
};

/**
 * Check if data passed is valid HTML element.
 */
const isElement = element => (element[0] || element).nodeType;

/**
 * Force reflow to recalculate element position / geometry.
 */
const reflow = element => element.offsetHeight;

export {
  each,
  getSelectorFromTarget,
  getToggleList,
  makeArray,
  isElement,
  reflow,
};
