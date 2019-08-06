// polyfill
import { closest } from "../polyfill";

// data map
import Data from "../util/data";

// util
import {
  each, //
  makeArray,
  getSelectorFromTarget,
  isElement,
} from "../util";

const ARROW_UP = "ArrowUp";
const IE_ARROW_UP = "Up";
const ARROW_DOWN = "ArrowDown";
const IE_ARROW_DOWN = "Down";
const ESC = "Escape";
const IE_ESC = "Esc";
const TAB = "Tab";

const Aria = {
  EXPANDED: "aria-expanded",
  POPUP: "aria-haspopup",
};

const ClassName = {
  DROPDOWN: "dropdown",
  TOGGLE: "dropdown__toggle",
  LIST: "dropdown__menu",
  SHOW: "dropdown__menu--show",
  ITEM: "dropdown__item",
};

const Selector = {
  DROPDOWN: '[data-toggle="dropdown"]',
};

class Dropdown {
  constructor(element) {
    if (!isElement(element)) {
      throw new TypeError("Element expected");
    }

    this._toggler = element;
    this._menu = Dropdown._getMenu(this._toggler);

    Data.set(element, this);
  }

  // Public
  toggle() {
    if (!this._menu) {
      return;
    }

    this._toggler.focus();

    const method = this._menu.classList.contains(ClassName.SHOW)
      ? "hide"
      : "show";

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
  }

  // Static
  static _getActiveToggler() {
    const active = document.querySelector(`.${ClassName.SHOW}`);

    if (!active) {
      return null;
    }

    let toggler = null;
    const togglerList = document.querySelectorAll(Selector.DROPDOWN);

    each(togglerList, togglerItem => {
      const selector = document.querySelector(
        getSelectorFromTarget(togglerItem)
      );

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

    const parent = closest(element, `.${ClassName.DROPDOWN}`);
    return parent ? parent.querySelector(Selector.DROPDOWN) : null;
  }

  static _getMenu(element) {
    const selector = getSelectorFromTarget(element);
    return document.querySelector(selector);
  }

  static _clearActive() {
    const active = document.querySelector(`.${ClassName.SHOW}`);

    if (active) {
      const toggler = Dropdown._getToggler(active);

      active.classList.remove(ClassName.SHOW);
      toggler.setAttribute(Aria.EXPANDED, false);
    }
  }

  static _keyDownHandler(event) {
    const { key, shiftKey, target } = event;
    const keys = [
      ARROW_UP,
      ARROW_DOWN,
      ESC,
      IE_ARROW_UP,
      IE_ARROW_DOWN,
      IE_ESC,
      TAB,
    ];

    if (keys.indexOf(key) === -1) {
      return;
    }

    const toggler = Dropdown._getToggler(target);

    if (!toggler) {
      return;
    }

    if (key === ESC || key === IE_ESC) {
      Dropdown._clearActive();
      // Re-focus the toggler button after closing
      toggler.focus();
      return;
    }

    const menu = Dropdown._getMenu(toggler);
    const elementList = menu.querySelectorAll(`.${ClassName.ITEM}`);
    const items = makeArray(elementList);

    if (!items.length) {
      return;
    }

    // Simulate click to open and apply attributes
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

    if (
      (key === ARROW_DOWN || key === IE_ARROW_DOWN) &&
      index < items.length - 1
    ) {
      index += 1;
    }

    items[index].focus();
  }

  static _toggle(event) {
    const { target } = event;
    const toggler = closest(target, Selector.DROPDOWN);

    if (!toggler) {
      const menu = closest(target, `.${ClassName.LIST}`);

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

export default Dropdown;
