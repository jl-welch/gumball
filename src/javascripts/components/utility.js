const each = (array, callback) => {
  for (let i = 0; i < array.length; i += 1) {
    const response = callback(array[i], i);

    if (response) {
      break;
    }
  }
};

const getSelectorFromTarget = element => {
  let selector = element.getAttribute("data-target");

  if (!selector || selector === "#") {
    const hrefAttr = element.getAttribute("href");

    selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
  }

  return document.querySelector(selector) ? selector : null;
};

const getToggleList = (element, dataAttr) => {
  // DEVTODO - Check for elements toggling with href
  const toggleElements = document.querySelectorAll(dataAttr);
  const toggleList = [];

  each(toggleElements, toggleElement => {
    const selector = getSelectorFromTarget(toggleElement);
    if (!selector) {
      return;
    }

    const filteredList = Array.from(document.querySelectorAll(selector)).filter(
      el => el === element
    );

    if (filteredList.length) {
      toggleList.push(toggleElement);
    }
  });

  return toggleList.length ? toggleList : null;
};

const isElement = element => (element[0] || element).nodeType;

const reflow = element => element.offsetHeight;

export { getToggleList, getSelectorFromTarget, each, isElement, reflow };
