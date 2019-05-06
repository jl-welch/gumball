(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

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
  var each = function each(array, callback) {
    for (var i = 0; i < array.length; i += 1) {
      var response = callback(array[i], i);
      if (response) break;
    }
  };
  /**
   * Get an elements selector from 'target' containing data-target or href.
   *
   * @param {HTMLElement} element The element target to get selector from
   * @returns {string|null}
   */


  var getSelectorFromTarget = function getSelectorFromTarget(element) {
    var selector = element.getAttribute("data-target");

    if (!selector || selector === "#") {
      var hrefAttr = element.getAttribute("href");
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


  var getToggleList = function getToggleList(element, dataAttr) {
    // DEVTODO - Check for elements toggling with href
    var toggleElements = document.querySelectorAll(dataAttr);
    var toggleList = [];
    each(toggleElements, function (toggleElement) {
      var selector = getSelectorFromTarget(toggleElement);
      if (!selector) return;
      var filteredList = Array.from(document.querySelectorAll(selector)).filter(function (el) {
        return el === element;
      });
      if (filteredList.length) toggleList.push(toggleElement);
    });
    return toggleList.length ? toggleList : null;
  };
  /**
   * Check for valid HTML element.
   *
   * @param {HTMLElement} element Element to check
   */


  var isElement = function isElement(element) {
    return (element[0] || element).nodeType;
  };
  /**
   * Force reflow to recalculate element height before transitioning.
   *
   * @param {*} element Element to get offsetHeight, forcing reflow
   */


  var reflow = function reflow(element) {
    return element.offsetHeight;
  };

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

  var Data = new Map();

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
  /** Class representing a collapsable. */

  var Collapse =
  /*#__PURE__*/
  function () {
    /**
     * Initialise collapse instance.
     * Adds element (key) and instance (value) to Data map.
     *
     * @param {HTMLElement} element Element to collapse
     */
    function Collapse(element) {
      _classCallCheck(this, Collapse);

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


    _createClass(Collapse, [{
      key: "toggle",
      value: function toggle() {
        var method = this._element.classList.contains(ClassName.SHOW) ? "hide" : "show";
        this[method]();
      }
      /**
       * Show collapsable.
       */

    }, {
      key: "show",
      value: function show() {
        if (this._collapsing || this._element.classList.contains(ClassName.SHOW)) return;

        this._element.classList.remove(ClassName.COLLAPSE);

        this._element.classList.add(ClassName.COLLAPSING);

        this._setCollapsing(true);

        each(this._togglers, function (toggler) {
          return toggler.setAttribute(Aria.EXPANDED, true);
        });

        this._element.addEventListener("transitionend", this._showCollapseEnd);

        this._element.style.height = "".concat(this._element.scrollHeight, "px");
      }
      /**
       * Hide collapsable.
       */

    }, {
      key: "hide",
      value: function hide() {
        if (this._collapsing || !this._element.classList.contains(ClassName.SHOW)) return;
        this._element.style.height = "".concat(this._element.scrollHeight, "px"); // Force reflow to recalculate element height before transitioning

        reflow(this._element);

        this._element.classList.remove(ClassName.COLLAPSE, ClassName.SHOW);

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
      /**
       * Remove element from Data map and set instance values to null.
       */

    }, {
      key: "dispose",
      value: function dispose() {
        Data["delete"](this._element);
        this._element = null;
        this._togglers = null;
        this._collapsing = null;
      } // private

      /**
       * Sets value of this._collapsing.
       *
       * @param {Boolean} bool
       * @private
       */

    }, {
      key: "_setCollapsing",
      value: function _setCollapsing(bool) {
        this._collapsing = bool;
      }
      /**
       * transitionend callback for show method.
       *
       * @private
       */

    }, {
      key: "_showCollapseEnd",
      value: function _showCollapseEnd() {
        this._element.classList.remove(ClassName.COLLAPSING);

        this._element.classList.add(ClassName.COLLAPSE, ClassName.SHOW);

        this._element.style.height = "";

        this._element.removeEventListener("transitionend", this._showCollapseEnd);

        this._setCollapsing(false);
      }
      /**
       * transitionend callback for hide method.
       *
       * @private
       */

    }, {
      key: "_hideCollapseEnd",
      value: function _hideCollapseEnd() {
        this._element.classList.remove(ClassName.COLLAPSING);

        this._element.classList.add(ClassName.COLLAPSE);

        this._element.removeEventListener("transitionend", this._hideCollapseEnd);

        this._setCollapsing(false);
      } // Static

      /**
       * Checks to see if element is set in Data map.
       * Used for click event listener.
       *
       * @param {HTMLElement} element Element to toggle collapse
       * @static
       */

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
    var toggler = event.target.closest(Selector.COLLAPSE);
    if (!toggler) return;

    if (toggler.tagName === "A") {
      event.preventDefault();
    }

    var selector = getSelectorFromTarget(toggler);
    var element = document.querySelector(selector);

    Collapse._toggle(element);
  });

  var Aria$1 = {
    EXPANDED: "aria-expanded",
    POPUP: "aria-haspopup"
  };
  var ClassName$1 = {
    DROPDOWN: "dropdown",
    TOGGLE: "dropdown__toggle",
    LIST: "dropdown__list",
    SHOW: "dropdown__list--show",
    ITEM: "dropdown__item"
  };
  var Selector$1 = {
    DROPDOWN: '[data-toggle="dropdown"]'
  };
  /** Class respresenting a dropdown element */

  var Dropdown =
  /*#__PURE__*/
  function () {
    /**
     * Initialise dropdown instance.
     * Adds element (key) and instance (value) to Data map.
     *
     * @param {HTMLElement} element Element to dropdown
     */
    function Dropdown(element) {
      _classCallCheck(this, Dropdown);

      if (!isElement(element)) {
        throw new TypeError("Element expected");
      }

      this._toggler = element;
      this._menu = Dropdown._getMenu(this._toggler);
      Data.set(element, this);
    } // Public

    /**
     * Toggle dropdown depending on current state.
     */


    _createClass(Dropdown, [{
      key: "toggle",
      value: function toggle() {
        if (!this._menu) return;

        this._toggler.focus();

        var method = this._menu.classList.contains(ClassName$1.SHOW) ? "hide" : "show";
        this[method]();
      }
      /**
       * Show dropdown.
       */

    }, {
      key: "show",
      value: function show() {
        if (this._menu.classList.contains(ClassName$1.SHOW)) return;

        Dropdown._clearActive();

        this._menu.classList.add(ClassName$1.SHOW);

        this._toggler.setAttribute(Aria$1.EXPANDED, true);
      }
      /**
       * Hide dropdown.
       */

    }, {
      key: "hide",
      value: function hide() {
        if (!this._menu.classList.contains(ClassName$1.SHOW)) return;

        this._menu.classList.remove(ClassName$1.SHOW);

        this._toggler.setAttribute(Aria$1.EXPANDED, false);
      } // Static

      /**
       * Get current active dropdown.
       * Only one element should be active at a time.
       *
       * @returns {Object}
       * @static
       */

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

    }, {
      key: "_getToggler",
      value: function _getToggler(element) {
        if (element.classList.contains(ClassName$1.TOGGLE)) return element;
        var parent = element.closest(".".concat(ClassName$1.DROPDOWN));
        return parent.querySelector(Selector$1.DROPDOWN);
      }
      /**
       * Get dropdown menu from dropdown toggler.
       *
       * @param {HTMLElement} element Dropdown toggler
       * @static
       */

    }, {
      key: "_getMenu",
      value: function _getMenu(element) {
        var selector = getSelectorFromTarget(element);
        return document.querySelector(selector);
      }
      /**
       * Hide current active dropdown.
       *
       * @static
       */

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
      /**
       * Keyboard support for dropdown.
       *
       * @param {Object} event Keydown event object
       * @param {string} event.key The keydown key name
       * @param {HTMLElement} event.target The keydown target element
       * @static
       */

    }, {
      key: "_keyDownHandler",
      value: function _keyDownHandler(_ref) {
        var key = _ref.key,
            target = _ref.target;
        if (key !== "Escape" && key !== "ArrowUp" && key !== "ArrowDown") return;

        var toggler = Dropdown._getToggler(target);

        if (key === "Escape") {
          Dropdown._clearActive(); // Re-focus the toggler button after closing


          toggler.focus();
          return;
        }

        var menu = Dropdown._getMenu(toggler);

        var items = Array.from(menu.querySelectorAll(".".concat(ClassName$1.ITEM)));

        if (!items.length) {
          return;
        } // Simulate click to open and apply attributes


        if (!menu.classList.contains(ClassName$1.SHOW)) {
          toggler.click();
        }

        if (target === toggler) {
          items[0].focus();
          return;
        }

        var index = items.indexOf(target);

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

    }, {
      key: "_toggle",
      value: function _toggle(event) {
        var toggler = event.target.closest(Selector$1.DROPDOWN);

        if (!toggler) {
          var menu = event.target.closest(".".concat(ClassName$1.LIST));

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

}));
