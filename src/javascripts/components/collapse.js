// polyfill
import { closest } from "../polyfill";

// data map
import Data from "../util/data";

// util
import {
  getToggleList,
  each,
  reflow,
  isElement,
  getSelectorFromTarget,
} from "../util";

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

class Collapse {
  constructor(element) {
    if (!isElement(element)) {
      throw new TypeError("Element expected");
    }

    this._showCollapseEnd = this._showCollapseEnd.bind(this);
    this._hideCollapseEnd = this._hideCollapseEnd.bind(this);

    this._element = element;
    this._togglers = getToggleList(element, Selector.COLLAPSE);
    this._collapsing = false;

    Data.set(element, this);
  }

  toggle() {
    const method = this._element.classList.contains(ClassName.SHOW)
      ? "hide"
      : "show";

    this[method]();
  }

  show() {
    if (this._collapsing || this._element.classList.contains(ClassName.SHOW)) {
      return;
    }

    this._element.classList.remove(ClassName.COLLAPSE);
    this._element.classList.add(ClassName.COLLAPSING);

    this._setCollapsing(true);

    each(this._togglers, (toggler) =>
      toggler.setAttribute(Aria.EXPANDED, true)
    );

    this._element.addEventListener("transitionend", this._showCollapseEnd);
    this._element.style.height = `${this._element.scrollHeight}px`;
  }

  hide() {
    if (this._collapsing || !this._element.classList.contains(ClassName.SHOW)) {
      return;
    }

    this._element.style.height = `${this._element.scrollHeight}px`;

    reflow(this._element);

    this._element.classList.remove(ClassName.COLLAPSE);
    this._element.classList.remove(ClassName.SHOW);
    this._element.classList.add(ClassName.COLLAPSING);

    this._setCollapsing(true);

    each(this._togglers, (toggler) => {
      const active = toggler.querySelectorAll(`.${ClassName.SHOW}`);
      if (!active.length) {
        toggler.setAttribute(Aria.EXPANDED, false);
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
  }

  // private
  _setCollapsing(bool) {
    this._collapsing = bool;
  }

  _showCollapseEnd() {
    this._element.classList.remove(ClassName.COLLAPSING);
    this._element.classList.add(ClassName.COLLAPSE);
    this._element.classList.add(ClassName.SHOW);
    this._element.style.height = "";

    this._element.removeEventListener("transitionend", this._showCollapseEnd);

    this._setCollapsing(false);
  }

  _hideCollapseEnd() {
    this._element.classList.remove(ClassName.COLLAPSING);
    this._element.classList.add(ClassName.COLLAPSE);

    this._element.removeEventListener("transitionend", this._hideCollapseEnd);

    this._setCollapsing(false);
  }

  // Static
  static _toggle(element) {
    let data = Data.get(element);

    if (!data) {
      data = new Collapse(element);
    }

    data.toggle();
  }
}

document.addEventListener("click", (event) => {
  const toggler = closest(event.target, Selector.COLLAPSE);
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

export default Collapse;
