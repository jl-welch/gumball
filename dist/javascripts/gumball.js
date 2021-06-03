(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['gumball-ui'] = {}));
}(this, (function (exports) { 'use strict';

  function selectorMatches(element, selector) {
    const proto = Element.prototype;
    const func = proto.matches || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector;
    return func.call(element, selector);
  }

  function closest(element, string) {
    do {
      if (selectorMatches(element, string)) return element; // eslint-disable-next-line no-param-reassign

      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);

    return null;
  }

  const Data = new Map();

  // polyfill
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

  // polyfill
  const Aria$1 = {
    EXPANDED: "aria-expanded"
  };
  const ClassName$1 = {
    COLLAPSE: "collapse",
    SHOW: "collapse--show",
    COLLAPSING: "collapsing"
  };
  const Selector$1 = {
    COLLAPSE: "[data-toggle='collapse']"
  };

  class Collapse {
    constructor(element) {
      if (!isElement(element)) {
        throw new TypeError("Element expected");
      }

      this._showCollapseEnd = this._showCollapseEnd.bind(this);
      this._hideCollapseEnd = this._hideCollapseEnd.bind(this);
      this._element = element;
      this._togglers = getToggleList(element, Selector$1.COLLAPSE);
      this._collapsing = false;
      Data.set(element, this);
    }

    toggle() {
      const method = this._element.classList.contains(ClassName$1.SHOW) ? "hide" : "show";
      this[method]();
    }

    show() {
      if (this._collapsing || this._element.classList.contains(ClassName$1.SHOW)) {
        return;
      }

      this._element.classList.remove(ClassName$1.COLLAPSE);

      this._element.classList.add(ClassName$1.COLLAPSING);

      this._setCollapsing(true);

      each(this._togglers, toggler => toggler.setAttribute(Aria$1.EXPANDED, true));

      this._element.addEventListener("transitionend", this._showCollapseEnd);

      this._element.style.height = "".concat(this._element.scrollHeight, "px");
    }

    hide() {
      if (this._collapsing || !this._element.classList.contains(ClassName$1.SHOW)) {
        return;
      }

      this._element.style.height = "".concat(this._element.scrollHeight, "px");
      reflow(this._element);

      this._element.classList.remove(ClassName$1.COLLAPSE);

      this._element.classList.remove(ClassName$1.SHOW);

      this._element.classList.add(ClassName$1.COLLAPSING);

      this._setCollapsing(true);

      each(this._togglers, toggler => {
        const active = toggler.querySelectorAll(".".concat(ClassName$1.SHOW));

        if (!active.length) {
          toggler.setAttribute(Aria$1.EXPANDED, false);
        }
      });
      this._element.style.height = "";

      this._element.addEventListener("transitionend", this._hideCollapseEnd);
    }

    dispose() {
      Data.delete(this._element);
      this._element = null;
      this._togglers = null;
      this._collapsing = null;
    } // private


    _setCollapsing(bool) {
      this._collapsing = bool;
    }

    _showCollapseEnd() {
      this._element.classList.remove(ClassName$1.COLLAPSING);

      this._element.classList.add(ClassName$1.COLLAPSE);

      this._element.classList.add(ClassName$1.SHOW);

      this._element.style.height = "";

      this._element.removeEventListener("transitionend", this._showCollapseEnd);

      this._setCollapsing(false);
    }

    _hideCollapseEnd() {
      this._element.classList.remove(ClassName$1.COLLAPSING);

      this._element.classList.add(ClassName$1.COLLAPSE);

      this._element.removeEventListener("transitionend", this._hideCollapseEnd);

      this._setCollapsing(false);
    } // Static


    static _toggle(element) {
      let data = Data.get(element);

      if (!data) {
        data = new Collapse(element);
      }

      data.toggle();
    }

  }

  document.addEventListener("click", event => {
    const toggler = closest(event.target, Selector$1.COLLAPSE);

    if (!toggler) {
      return;
    }

    if (toggler.tagName === "A") {
      event.preventDefault();
    }

    const selector = getSelectorFromTarget(toggler);
    const element = document.querySelector(selector);

    Collapse._toggle(element);
  });

  // polyfill
  const ARROW_UP = "ArrowUp";
  const IE_ARROW_UP = "Up";
  const ARROW_DOWN = "ArrowDown";
  const IE_ARROW_DOWN = "Down";
  const ESC = "Escape";
  const IE_ESC = "Esc";
  const TAB = "Tab";
  const Aria = {
    EXPANDED: "aria-expanded",
    POPUP: "aria-haspopup"
  };
  const ClassName = {
    DROPDOWN: "dropdown",
    TOGGLE: "dropdown__toggle",
    LIST: "dropdown__menu",
    SHOW: "dropdown__menu--show",
    ITEM: "dropdown__item"
  };
  const Selector = {
    DROPDOWN: '[data-toggle="dropdown"]'
  };

  class Dropdown {
    constructor(element) {
      if (!isElement(element)) {
        throw new TypeError("Element expected");
      }

      this._toggler = element;
      this._menu = Dropdown._getMenu(this._toggler);
      Data.set(element, this);
    } // Public


    toggle() {
      if (!this._menu) {
        return;
      }

      this._toggler.focus();

      const method = this._menu.classList.contains(ClassName.SHOW) ? "hide" : "show";
      this[method]();
    }

    show() {
      if (this._menu.classList.contains(ClassName.SHOW)) {
        return;
      }

      Dropdown._clearActive();

      this._menu.classList.add(ClassName.SHOW);

      this._toggler.setAttribute(Aria.EXPANDED, true);
    }

    hide() {
      if (!this._menu.classList.contains(ClassName.SHOW)) {
        return;
      }

      this._menu.classList.remove(ClassName.SHOW);

      this._toggler.setAttribute(Aria.EXPANDED, false);
    } // Static


    static _getActiveToggler() {
      const active = document.querySelector(".".concat(ClassName.SHOW));

      if (!active) {
        return null;
      }

      let toggler = null;
      const togglerList = document.querySelectorAll(Selector.DROPDOWN);
      each(togglerList, togglerItem => {
        const selector = document.querySelector(getSelectorFromTarget(togglerItem));

        if (selector === active) {
          toggler = togglerItem;
          return "break";
        }

        return null;
      });
      return toggler;
    }

    static _getToggler(element) {
      if (element.classList.contains(ClassName.TOGGLE)) {
        return element;
      }

      const parent = closest(element, ".".concat(ClassName.DROPDOWN));
      return parent ? parent.querySelector(Selector.DROPDOWN) : null;
    }

    static _getMenu(element) {
      const selector = getSelectorFromTarget(element);
      return document.querySelector(selector);
    }

    static _clearActive() {
      const active = document.querySelector(".".concat(ClassName.SHOW));

      if (active) {
        const toggler = Dropdown._getToggler(active);

        active.classList.remove(ClassName.SHOW);
        toggler.setAttribute(Aria.EXPANDED, false);
      }
    }

    static _keyDownHandler(event) {
      const {
        key,
        shiftKey,
        target
      } = event;
      const keys = [ARROW_UP, ARROW_DOWN, ESC, IE_ARROW_UP, IE_ARROW_DOWN, IE_ESC, TAB];

      if (keys.indexOf(key) === -1) {
        return;
      }

      const toggler = Dropdown._getToggler(target);

      if (!toggler) {
        return;
      }

      if (key === ESC || key === IE_ESC) {
        Dropdown._clearActive(); // Re-focus the toggler button after closing


        toggler.focus();
        return;
      }

      const menu = Dropdown._getMenu(toggler);

      const elementList = menu.querySelectorAll(".".concat(ClassName.ITEM));
      const items = makeArray(elementList);

      if (!items.length) {
        return;
      } // Simulate click to open and apply attributes


      if (!menu.classList.contains(ClassName.SHOW)) {
        toggler.click();
        items[0].focus();
        return;
      }

      let index = items.indexOf(target);

      if (key === TAB) {
        if (index + 1 >= items.length && !shiftKey) {
          Dropdown._clearActive();
        }

        return;
      }

      event.preventDefault();

      if ((key === ARROW_UP || key === IE_ARROW_UP) && index > 0) {
        index -= 1;
      }

      if ((key === ARROW_DOWN || key === IE_ARROW_DOWN) && index < items.length - 1) {
        index += 1;
      }

      items[index].focus();
    }

    static _toggle(event) {
      const {
        target
      } = event;
      const toggler = closest(target, Selector.DROPDOWN);

      if (!toggler) {
        const menu = closest(target, ".".concat(ClassName.LIST));

        if (!menu) {
          Dropdown._clearActive();
        }

        return;
      }

      if (toggler.tagName === "A" && !toggler.getAttribute("data-follow")) {
        event.preventDefault();
      }

      let data = Data.get(toggler);

      if (!data) {
        data = new Dropdown(toggler);
      }

      data.toggle();
    }

  }

  document.addEventListener("keydown", Dropdown._keyDownHandler);
  document.addEventListener("click", Dropdown._toggle);

  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
