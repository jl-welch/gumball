(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.gumball = {}));
}(this, function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function selectorMatches(element, selector) {
    var proto = Element.prototype;
    var func = proto.matches || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector;
    return func.call(element, selector);
  }

  function closest(element, string) {
    do {
      if (selectorMatches(element, string)) return element; // eslint-disable-next-line no-param-reassign

      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);

    return null;
  }

  var Data = new Map();

  // polyfill
  /**
   * Run-of-the-mill for loop wrapped up.
   * Allow to return "break" to break out of loop early.
   */

  var each = function each(array, callback) {
    for (var i = 0; i < array.length; i += 1) {
      var response = callback(array[i], i);

      if (response === "break") {
        break;
      }
    }
  };
  /**
   * Create array, useful for converting nodeList to array.
   */


  var makeArray = function makeArray(nodeList) {
    if (!nodeList) {
      return [];
    }

    return [].slice.call(nodeList);
  };
  /**
   * Return target string from data-target or href attribute.
   */


  var getSelectorFromTarget = function getSelectorFromTarget(element) {
    var selector = element.getAttribute("data-target");

    if (!selector) {
      var hrefAttr = element.getAttribute("href");
      selector = hrefAttr && hrefAttr !== "#" ? hrefAttr : null;
    }

    return document.querySelector(selector) ? selector : null;
  };
  /**
   * Find 'togglers' which contain the data attribute parameter.
   * Add 'toggler' to array if they point to the element parameter.
   * Return array if not empty.
   */


  var getToggleList = function getToggleList(element, dataAttr) {
    var toggleElements = document.querySelectorAll(dataAttr);
    var toggleList = [];
    each(toggleElements, function (toggleElement) {
      var selector = getSelectorFromTarget(toggleElement);

      if (!selector) {
        return;
      }

      var match = selectorMatches(element, selector);

      if (match) {
        toggleList.push(toggleElement);
      }
    });
    return toggleList.length ? toggleList : null;
  };
  /**
   * Check if data passed is valid HTML element.
   */


  var isElement = function isElement(element) {
    return (element[0] || element).nodeType;
  };
  /**
   * Force reflow to recalculate element position / geometry.
   */


  var reflow = function reflow(element) {
    return element.offsetHeight;
  };

  var Aria = {
    EXPANDED: "aria-expanded"
  };
  var ClassName = {
    COLLAPSE: "collapse",
    SHOW: "collapse--show",
    COLLAPSING: "collapsing"
  };
  var Selector = {
    COLLAPSE: "[data-toggle='collapse']"
  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element) {
      _classCallCheck(this, Collapse);

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

    _createClass(Collapse, [{
      key: "toggle",
      value: function toggle() {
        var method = this._element.classList.contains(ClassName.SHOW) ? "hide" : "show";
        this[method]();
      }
    }, {
      key: "show",
      value: function show() {
        if (this._collapsing || this._element.classList.contains(ClassName.SHOW)) {
          return;
        }

        this._element.classList.remove(ClassName.COLLAPSE);

        this._element.classList.add(ClassName.COLLAPSING);

        this._setCollapsing(true);

        each(this._togglers, function (toggler) {
          return toggler.setAttribute(Aria.EXPANDED, true);
        });

        this._element.addEventListener("transitionend", this._showCollapseEnd);

        this._element.style.height = "".concat(this._element.scrollHeight, "px");
      }
    }, {
      key: "hide",
      value: function hide() {
        if (this._collapsing || !this._element.classList.contains(ClassName.SHOW)) {
          return;
        }

        this._element.style.height = "".concat(this._element.scrollHeight, "px");
        reflow(this._element);

        this._element.classList.remove(ClassName.COLLAPSE);

        this._element.classList.remove(ClassName.SHOW);

        this._element.classList.add(ClassName.COLLAPSING);

        this._setCollapsing(true);

        each(this._togglers, function (toggler) {
          var active = toggler.querySelectorAll(".".concat(ClassName.SHOW));

          if (!active.length) {
            toggler.setAttribute(Aria.EXPANDED, false);
          }
        });
        this._element.style.height = "";

        this._element.addEventListener("transitionend", this._hideCollapseEnd);
      }
    }, {
      key: "dispose",
      value: function dispose() {
        Data.delete(this._element);
        this._element = null;
        this._togglers = null;
        this._collapsing = null;
      } // private

    }, {
      key: "_setCollapsing",
      value: function _setCollapsing(bool) {
        this._collapsing = bool;
      }
    }, {
      key: "_showCollapseEnd",
      value: function _showCollapseEnd() {
        this._element.classList.remove(ClassName.COLLAPSING);

        this._element.classList.add(ClassName.COLLAPSE);

        this._element.classList.add(ClassName.SHOW);

        this._element.style.height = "";

        this._element.removeEventListener("transitionend", this._showCollapseEnd);

        this._setCollapsing(false);
      }
    }, {
      key: "_hideCollapseEnd",
      value: function _hideCollapseEnd() {
        this._element.classList.remove(ClassName.COLLAPSING);

        this._element.classList.add(ClassName.COLLAPSE);

        this._element.removeEventListener("transitionend", this._hideCollapseEnd);

        this._setCollapsing(false);
      } // Static

    }], [{
      key: "_toggle",
      value: function _toggle(element) {
        var data = Data.get(element);

        if (!data) {
          data = new Collapse(element);
        }

        data.toggle();
      }
    }]);

    return Collapse;
  }();

  document.addEventListener("click", function (event) {
    var toggler = closest(event.target, Selector.COLLAPSE);

    if (!toggler) {
      return;
    }

    if (toggler.tagName === "A") {
      event.preventDefault();
    }

    var selector = getSelectorFromTarget(toggler);
    var element = document.querySelector(selector);

    Collapse._toggle(element);
  });

  var ARROW_UP = "ArrowUp";
  var IE_ARROW_UP = "Up";
  var ARROW_DOWN = "ArrowDown";
  var IE_ARROW_DOWN = "Down";
  var ESC = "Escape";
  var IE_ESC = "Esc";
  var TAB = "Tab";
  var Aria$1 = {
    EXPANDED: "aria-expanded",
    POPUP: "aria-haspopup"
  };
  var ClassName$1 = {
    DROPDOWN: "dropdown",
    TOGGLE: "dropdown__toggle",
    LIST: "dropdown__menu",
    SHOW: "dropdown__menu--show",
    ITEM: "dropdown__item"
  };
  var Selector$1 = {
    DROPDOWN: '[data-toggle="dropdown"]'
  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element) {
      _classCallCheck(this, Dropdown);

      if (!isElement(element)) {
        throw new TypeError("Element expected");
      }

      this._toggler = element;
      this._menu = Dropdown._getMenu(this._toggler);
      Data.set(element, this);
    } // Public


    _createClass(Dropdown, [{
      key: "toggle",
      value: function toggle() {
        if (!this._menu) {
          return;
        }

        this._toggler.focus();

        var method = this._menu.classList.contains(ClassName$1.SHOW) ? "hide" : "show";
        this[method]();
      }
    }, {
      key: "show",
      value: function show() {
        if (this._menu.classList.contains(ClassName$1.SHOW)) {
          return;
        }

        Dropdown._clearActive();

        this._menu.classList.add(ClassName$1.SHOW);

        this._toggler.setAttribute(Aria$1.EXPANDED, true);
      }
    }, {
      key: "hide",
      value: function hide() {
        if (!this._menu.classList.contains(ClassName$1.SHOW)) {
          return;
        }

        this._menu.classList.remove(ClassName$1.SHOW);

        this._toggler.setAttribute(Aria$1.EXPANDED, false);
      } // Static

    }], [{
      key: "_getActiveToggler",
      value: function _getActiveToggler() {
        var active = document.querySelector(".".concat(ClassName$1.SHOW));

        if (!active) {
          return null;
        }

        var toggler = null;
        var togglerList = document.querySelectorAll(Selector$1.DROPDOWN);
        each(togglerList, function (togglerItem) {
          var selector = document.querySelector(getSelectorFromTarget(togglerItem));

          if (selector === active) {
            toggler = togglerItem;
            return "break";
          }

          return null;
        });
        return toggler;
      }
    }, {
      key: "_getToggler",
      value: function _getToggler(element) {
        if (element.classList.contains(ClassName$1.TOGGLE)) {
          return element;
        }

        var parent = closest(element, ".".concat(ClassName$1.DROPDOWN));
        return parent ? parent.querySelector(Selector$1.DROPDOWN) : null;
      }
    }, {
      key: "_getMenu",
      value: function _getMenu(element) {
        var selector = getSelectorFromTarget(element);
        return document.querySelector(selector);
      }
    }, {
      key: "_clearActive",
      value: function _clearActive() {
        var active = document.querySelector(".".concat(ClassName$1.SHOW));

        if (active) {
          var toggler = Dropdown._getToggler(active);

          active.classList.remove(ClassName$1.SHOW);
          toggler.setAttribute(Aria$1.EXPANDED, false);
        }
      }
    }, {
      key: "_keyDownHandler",
      value: function _keyDownHandler(event) {
        var key = event.key,
            shiftKey = event.shiftKey,
            target = event.target;
        var keys = [ARROW_UP, ARROW_DOWN, ESC, IE_ARROW_UP, IE_ARROW_DOWN, IE_ESC, TAB];

        if (keys.indexOf(key) === -1) {
          return;
        }

        var toggler = Dropdown._getToggler(target);

        if (!toggler) {
          return;
        }

        if (key === ESC || key === IE_ESC) {
          Dropdown._clearActive(); // Re-focus the toggler button after closing


          toggler.focus();
          return;
        }

        var menu = Dropdown._getMenu(toggler);

        var elementList = menu.querySelectorAll(".".concat(ClassName$1.ITEM));
        var items = makeArray(elementList);

        if (!items.length) {
          return;
        } // Simulate click to open and apply attributes


        if (!menu.classList.contains(ClassName$1.SHOW)) {
          toggler.click();
          items[0].focus();
          return;
        }

        var index = items.indexOf(target);

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
    }, {
      key: "_toggle",
      value: function _toggle(event) {
        var target = event.target;
        var toggler = closest(target, Selector$1.DROPDOWN);

        if (!toggler) {
          var menu = closest(target, ".".concat(ClassName$1.LIST));

          if (!menu) {
            Dropdown._clearActive();
          }

          return;
        }

        if (toggler.tagName === "A" && !toggler.getAttribute("data-follow")) {
          event.preventDefault();
        }

        var data = Data.get(toggler);

        if (!data) {
          data = new Dropdown(toggler);
        }

        data.toggle();
      }
    }]);

    return Dropdown;
  }();

  document.addEventListener("keydown", Dropdown._keyDownHandler);
  document.addEventListener("click", Dropdown._toggle);

  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
