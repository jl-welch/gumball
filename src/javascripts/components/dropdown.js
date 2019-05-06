import Data from "../struct/data";
import { isElement, getSelectorFromTarget, each } from "./utility";

const Aria = {
  EXPANDED: "aria-expanded",
  POPUP: "aria-haspopup",
};

const ClassName = {
  DROPDOWN: "dropdown",
  TOGGLE: "dropdown__toggle",
  LIST: "dropdown__list",
  SHOW: "dropdown__list--show",
  ITEM: "dropdown__item",
};

const Selector = {
  DROPDOWN: '[data-toggle="dropdown"]',
};

/** Class respresenting a dropdown element */
class Dropdown {
  /**
   * Initialise dropdown instance.
   * Adds element (key) and instance (value) to Data map.
   *
   * @param {HTMLElement} element Element to dropdown
   */
  constructor(element) {
    if (!isElement(element)) {
      throw new TypeError("Element expected");
    }

    this._toggler = element;
    this._menu = Dropdown._getMenu(this._toggler);

    Data.set(element, this);
  }

  // Public

  /**
   * Toggle dropdown depending on current state.
   */
  toggle() {
    if (!this._menu) return;

    this._toggler.focus();

    const method = this._menu.classList.contains(ClassName.SHOW)
      ? "hide"
      : "show";

    this[method]();
  }

  /**
   * Show dropdown.
   */
  show() {
    if (this._menu.classList.contains(ClassName.SHOW)) return;

    Dropdown._clearActive();

    this._menu.classList.add(ClassName.SHOW);
    this._toggler.setAttribute(Aria.EXPANDED, true);
  }

  /**
   * Hide dropdown.
   */
  hide() {
    if (!this._menu.classList.contains(ClassName.SHOW)) return;

    this._menu.classList.remove(ClassName.SHOW);
    this._toggler.setAttribute(Aria.EXPANDED, false);
  }

  // Static

  /**
   * Get current active dropdown.
   * Only one element should be active at a time.
   *
   * @returns {Object}
   * @static
   */
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
        return true;
      }

      return false;
    });

    return toggler;
  }

  /**
   * Get dropdown toggler from dropdown menu.
   *
   * @param {HTMLElement} element
   */
  static _getToggler(element) {
    if (element.classList.contains(ClassName.TOGGLE)) return element;

    const parent = element.closest(`.${ClassName.DROPDOWN}`);
    return parent.querySelector(Selector.DROPDOWN);
  }

  /**
   * Get dropdown menu from dropdown toggler.
   *
   * @param {HTMLElement} element Dropdown toggler
   * @static
   */
  static _getMenu(element) {
    const selector = getSelectorFromTarget(element);
    return document.querySelector(selector);
  }

  /**
   * Hide current active dropdown.
   *
   * @static
   */
  static _clearActive() {
    const active = document.querySelector(`.${ClassName.SHOW}`);

    if (active) {
      const toggler = Dropdown._getToggler(active);

      active.classList.remove(ClassName.SHOW);
      toggler.setAttribute(Aria.EXPANDED, false);
    }
  }

  /**
   * Keyboard support for dropdown.
   *
   * @param {Object} event Keydown event object
   * @param {string} event.key The keydown key name
   * @param {HTMLElement} event.target The keydown target element
   * @static
   */
  static _keyDownHandler({ key, target }) {
    if (key !== "Escape" && key !== "ArrowUp" && key !== "ArrowDown")
      return;

    const toggler = Dropdown._getToggler(target);

    if (key === "Escape") {
      Dropdown._clearActive();
      // Re-focus the toggler button after closing
      toggler.focus();
      return;
    }

    const menu = Dropdown._getMenu(toggler);
    const items = Array.from(
      menu.querySelectorAll(`.${ClassName.ITEM}`)
    );

    if (!items.length) {
      return;
    }

    // Simulate click to open and apply attributes
    if (!menu.classList.contains(ClassName.SHOW)) {
      toggler.click();
    }

    if (target === toggler) {
      items[0].focus();
      return;
    }

    let index = items.indexOf(target);

    if (key === "ArrowUp" && index > 0) {
      index -= 1;
    }

    if (key === "ArrowDown" && index < items.length - 1) {
      index += 1;
    }

    items[index].focus();
  }

  /**
   * Checks to see if element is set in Data map.
   * Used for click event listener.
   *
   * @param {Object} event Click event object
   * @static
   */
  static _toggle(event) {
    const toggler = event.target.closest(Selector.DROPDOWN);

    if (!toggler) {
      const menu = event.target.closest(`.${ClassName.LIST}`);

      if (!menu) {
        Dropdown._clearActive();
      }
      return;
    }

    if (
      toggler.tagName === "A" &&
      !toggler.getAttribute("data-follow")
    ) {
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
