'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) return;
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null) this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

var Event = function () {
  function Event(selector) {
    _classCallCheck(this, Event);

    this.Selector = selector;
    this.listeners = {};

    document.documentElement.addEventListener("click", this.emit.bind(this), false);
  }

  _createClass(Event, [{
    key: 'addListener',
    value: function addListener(name, callback) {
      this.listeners[name] = callback;
    }
  }, {
    key: 'emit',
    value: function emit(event) {
      var element = void 0,
          action = false;

      element = event.target.closest('[' + this.Selector + ']');

      action = element ? element.getAttribute(this.Selector) : "clear";

      if (this.listeners[action]) this.listeners[action](event);
    }
  }]);

  return Event;
}();

var Target = function (_) {
  var Selector = "data-target";

  var Target = {
    query: function query(event) {
      var element = event.target.closest('[' + Selector + ']');

      if (element) {
        var attribute = element.getAttribute(Selector),
            target = document.querySelector(attribute);

        return target;
      }

      return null;
    },
    queryAncestor: function queryAncestor(event, selector) {
      var element = event.target.closest(selector);
      return element ? element : null;
    }
  };

  return Target;
}();
var Dismiss = function (_) {
  var Selector = {
    MODAL: "modal",
    ALERT: "alert",
    TOGGLE: "data-toggle"
  };

  var ClassName = {
    SHOW: "show",
    FADE: "fade-out"
  };

  var DismissMethods = {
    // Temporarily remove show class causing item to be visible
    clear: function clear(selector) {
      var element = document.querySelector(selector);
      if (element) element.classList.remove(ClassName.SHOW);
    },


    // Remove element from the DOM
    removeElement: function removeElement(element) {
      function removeEvent() {
        // remove: see polyfill/remove.js
        element.remove();
        element.removeEventListener("transitionend", removeEvent, false);
      }

      element.addEventListener("transitionend", removeEvent, false);
      element.classList.add(ClassName.FADE);
    }
  };

  var DismissEvent = new Event("data-dismiss");

  DismissEvent.addListener("alert", function (event) {
    event.preventDefault();

    DismissMethods.clear('.' + ClassName.SHOW);

    var element = Target.queryAncestor(event, '.' + Selector.ALERT);

    if (element) DismissMethods.removeElement(element);
  });

  // This listener will be run if the user doesn't click on an event element
  // Removing the currently visible show element
  DismissEvent.addListener("clear", function (event) {
    // Look up the list of parents and check to see if we are inside a shown element
    // This will prevent for example a dropdown closing if you click an element inside
    var ancestorIsShown = Target.queryAncestor(event, '.' + ClassName.SHOW);
    if (!ancestorIsShown) {
      var toggleIsClicked = Target.queryAncestor(event, '[' + Selector.TOGGLE + ']');
      if (toggleIsClicked === null) DismissMethods.clear('.' + ClassName.SHOW);
    }
  });

  DismissEvent.addListener("modal", function (event) {
    event.preventDefault();

    DismissMethods.clear('.' + Selector.MODAL + '.' + ClassName.SHOW);
  });

  DismissEvent.addListener("selector", function (event) {
    event.preventDefault();

    DismissMethods.clear('.' + ClassName.SHOW);

    var element = Target.query(event);

    if (element) DismissMethods.removeElement(element);
  });

  return DismissEvent;
}();

var Toggle = function (_) {
  var ClassName = {
    SHOW: "show"
  };

  var Aria = {
    HIDDEN: "aria-hidden"
  };

  var Modal = {
    close: function close() {
      var element = document.querySelector('.' + ClassName.SHOW);
      if (element) {
        element.classList.remove(ClassName.SHOW);
        Modal.setAriaHidden(element);
      }
    },
    setAriaHidden: function setAriaHidden(element) {
      element.setAttribute(Aria.HIDDEN, "true");
    },
    removeAriaHidden: function removeAriaHidden(element) {
      element.removeAttribute(Aria.HIDDEN);
    },
    open: function open(element) {
      Modal.close();

      if (element && !element.classList.contains(ClassName.SHOW)) {
        element.classList.add(ClassName.SHOW);
        Modal.removeAriaHidden(element);
      }
    }
  };

  var Dropdown = {
    close: function close(element) {
      element.classList.remove(ClassName.SHOW);
    },
    open: function open(target, current) {
      if (!current) target.classList.add(ClassName.SHOW);
    }
  };

  var Collapse = {
    collapsing: false,
    duration: 24,

    ease: function ease(time, from, change) {
      time /= Collapse.duration / 2;
      if (time < 1) return change / 2 * time * time + from;
      time--;
      return -change / 2 * (time * (time - 2) - 1) + from;
    },
    animate: function animate(el, from, to, change, ancestor, time) {
      el.style.height = Collapse.ease(++time, from, change) + 'px';

      if (time < Collapse.duration) {
        requestAnimationFrame(function (_) {
          return Collapse.animate(el, from, to, change, ancestor, time);
        });
      } else {
        el.style.height = to <= 1 ? "0" : "auto";
        if (!ancestor) Collapse.collapsing = false;
      }
    },
    toggle: function toggle(el, from, to, callback, ancestor) {
      Collapse.collapsing = true;

      var change = to - from;

      if (ancestor && callback) {
        var height = ancestor.offsetHeight;
        callback(ancestor, height, to + height - from, Collapse.toggle);
      }

      Collapse.animate(el, from, to, change, ancestor, 0);
    },
    getAriaExpanded: function getAriaExpanded(el) {
      return el.getAttribute("aria-expanded");
    },
    setAriaExpanded: function setAriaExpanded(el) {
      var a = Collapse.getAriaExpanded(el) === "false" ? "true" : "false";
      el.setAttribute("aria-expanded", a);

      return a;
    }
  };

  var ToggleEvent = new Event("data-toggle");

  ToggleEvent.addListener("collapse", function (event) {
    var element = Target.query(event);

    if (element) {
      Collapse.setAriaExpanded(element);

      var ancestor = Target.queryAncestor(event, '.collapse');

      var sHeight = element.scrollHeight,
          oHeight = element.offsetHeight;

      if (!Collapse.collapsing) Collapse.toggle(element, oHeight, sHeight - oHeight, Collapse.toggle, ancestor);
    }
  });

  ToggleEvent.addListener("dropdown", function (event) {
    var element = Target.query(event);

    if (element) {
      var current = element.classList.contains(ClassName.SHOW);
      Dropdown.close(element);
      Dropdown.open(element, current);
    }
  });

  ToggleEvent.addListener("modal", function (event) {
    event.preventDefault();

    var element = Target.query(event);

    Modal.open(element);
  });
}();