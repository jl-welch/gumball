import Data from "../struct/data";
import {
  getToggleList,
  each,
  reflow,
  isElement,
  getSelectorFromTarget,
} from "./utility";

const Aria = {
  EXPANDED: "aria-expanded",
};

const ClassName = {
  COLLAPSE: "collapse",
  SHOW: "collapse--show",
  COLLAPSING: "collapsing",
};

const Selector = {
  COLLAPSE: "[data-toggle='collapse']",
};

/** Class representing a collapsable. */
class Collapse {
  /**
   * Initialise collapse instance.
   * Adds element (key) and instance (value) to Data map.
   *
   * @param {HTMLElement} element Element to collapse
   */
  constructor(element) {
    if (!isElement(element)) {
      throw new TypeError("Element expected");
    }

    this._element = element;
    this._togglers = getToggleList(element, Selector.COLLAPSE);
    this._collapsing = false;

    Data.set(element, this);
  }

  /**
   * Toggles a collapsable depending on its current state.
   */
  toggle() {
    const method = this._element.classList.contains(ClassName.SHOW)
      ? "hide"
      : "show";

    this[method]();
  }

  /**
   * Show collapsable.
   */
  show() {
    if (
      this._collapsing ||
      this._element.classList.contains(ClassName.SHOW)
    )
      return;

    this._element.classList.remove(ClassName.COLLAPSE);
    this._element.classList.add(ClassName.COLLAPSING);

    this._setCollapsing(true);

    each(this._togglers, toggler =>
      toggler.setAttribute(Aria.EXPANDED, true)
    );

    this._element.addEventListener(
      "transitionend",
      this._showCollapseEnd
    );
    this._element.style.height = `${this._element.scrollHeight}px`;
  }

  /**
   * Hide collapsable.
   */
  hide() {
    if (
      this._collapsing ||
      !this._element.classList.contains(ClassName.SHOW)
    )
      return;

    this._element.style.height = `${this._element.scrollHeight}px`;

    // Force reflow to recalculate element height before transitioning
    reflow(this._element);

    this._element.classList.remove(
      ClassName.COLLAPSE,
      ClassName.SHOW
    );
    this._element.classList.add(ClassName.COLLAPSING);

    this._setCollapsing(true);

    each(this._togglers, toggler => {
      const active = toggler.querySelectorAll(`.${ClassName.SHOW}`);
      if (!active.length) {
        toggler.setAttribute(Aria.EXPANDED, false);
      }
    });

    this._element.style.height = "";
    this._element.addEventListener(
      "transitionend",
      this._hideCollapseEnd
    );
  }

  /**
   * Remove element from Data map and set instance values to null.
   */
  dispose() {
    Data.delete(this._element);

    this._element = null;
    this._togglers = null;
    this._collapsing = null;
  }

  // private

  /**
   * Sets value of this._collapsing.
   *
   * @param {Boolean} bool
   * @private
   */
  _setCollapsing(bool) {
    this._collapsing = bool;
  }

  /**
   * transitionend callback for show method.
   *
   * @private
   */
  _showCollapseEnd() {
    this._element.classList.remove(ClassName.COLLAPSING);
    this._element.classList.add(ClassName.COLLAPSE, ClassName.SHOW);
    this._element.style.height = "";
    this._element.removeEventListener(
      "transitionend",
      this._showCollapseEnd
    );
    this._setCollapsing(false);
  }

  /**
   * transitionend callback for hide method.
   *
   * @private
   */
  _hideCollapseEnd() {
    this._element.classList.remove(ClassName.COLLAPSING);
    this._element.classList.add(ClassName.COLLAPSE);
    this._element.removeEventListener(
      "transitionend",
      this._hideCollapseEnd
    );
    this._setCollapsing(false);
  }

  // Static

  /**
   * Checks to see if element is set in Data map.
   * Used for click event listener.
   *
   * @param {HTMLElement} element Element to toggle collapse
   * @static
   */
  static _toggle(element) {
    let data = Data.get(element);

    if (!data) {
      data = new Collapse(element);
    }

    data.toggle();
  }
}

document.addEventListener("click", event => {
  const toggler = event.target.closest(Selector.COLLAPSE);
  if (!toggler) return;

  if (toggler.tagName === "A") {
    event.preventDefault();
  }

  const selector = getSelectorFromTarget(toggler);
  const element = document.querySelector(selector);

  Collapse._toggle(element);
});

export default Collapse;
