'use strict';

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
var Event = function (_) {

  var Attributes = {
    EVENT: "data-event",
    TARGET: "data-target",
    CLOSE: "data-dismiss"
  };

  var Event = {
    listeners: {},

    // Add custom method to listeners
    addListener: function addListener(name, cb) {
      Event.listeners[name] = cb;
    },


    // Run action on element event
    // element.addEventListener("click", Event.action, false)
    action: function action(event) {
      var listeners = Event.listeners,
          element = event.target.closest('[' + Attributes.EVENT + ']') || event.target.closest('[' + Attributes.CLOSE + ']'),
          action = element ? element.getAttribute(Attributes.EVENT) || element.getAttribute(Attributes.CLOSE) : null;

      if (listeners[action]) listeners[action](event);
    },
    target: function target(event) {
      var element = event.target.closest('[' + Attributes.TARGET + ']');

      if (element) {
        var attribute = element.getAttribute(Attributes.TARGET),
            target = document.querySelector('#' + attribute);

        return target;
      }

      return null;
    }
  };

  return Event;
}();

document.documentElement.addEventListener("click", Event.action, false);
(function (_) {
  var Collapse = {
    element: document.querySelectorAll("[data-collapse]"),
    duration: 30 / 100 * 60,
    collapsing: false,

    init: function init() {
      Collapse.bind();
    },
    ancestor: function ancestor(el) {
      for (; el && el !== document; el = el.parentNode) {
        if (el.matches(".collapse")) return el;
      }
    },
    ease: function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    },
    animate: function animate(el, from, to, change, ancestor, time) {
      el.style.height = Collapse.ease(++time, from, change, Collapse.duration) + 'px';

      if (time < Collapse.duration) {
        requestAnimationFrame(function (_) {
          return Collapse.animate(el, from, to, change, ancestor, time);
        });
      } else {
        el.style.height = to <= 1 ? "0" : "auto";
        if (!ancestor) Collapse.collapsing = false;
      }
    },
    toggle: function toggle(el, from, to, cb) {
      Collapse.collapsing = true;

      var change = to - from,
          ancestor = Collapse.ancestor(el.parentNode);

      if (ancestor && cb) {
        var height = ancestor.offsetHeight;
        cb(ancestor, height, to + height - from, Collapse.toggle);
      }

      Collapse.animate(el, from, to, change, ancestor, 0);
    },
    getAria: function getAria(el) {
      return el.getAttribute("aria-expanded");
    },
    setAria: function setAria(el) {
      var a = Collapse.getAria(el) === "false" ? "true" : "false";
      el.setAttribute("aria-expanded", a);

      return a;
    },
    hideOnLoad: function hideOnLoad(el, target) {
      var aria = Collapse.getAria(el);
      if (aria == 'false') target.style.height = "0px";
      target.style.overflow = "hidden";
    },
    addEvent: function addEvent(el, target) {
      el.addEventListener("click", function (e) {
        e.preventDefault();

        Collapse.setAria(el);

        var sHeight = target.scrollHeight,
            oHeight = target.offsetHeight;

        if (!Collapse.collapsing) Collapse.toggle(target, oHeight, sHeight - oHeight, Collapse.toggle);
      });
    },
    bind: function bind() {
      Collapse.element.forEach(function (el) {
        var target = document.querySelector('#' + el.getAttribute("data-collapse"));
        if (!target) return;

        Collapse.hideOnLoad(el, target);
        Collapse.addEvent(el, target);
      });
    }
  };

  Collapse.init();
})();
var Dismiss = function (_) {
  var ClassName = {
    FADE: "fade-out"
  };

  var Dismiss = {
    remove: function remove(target) {

      function removeElement() {
        target.remove();
        target.removeEventListener("transitionend", removeElement, false);
      }

      target.addEventListener("transitionend", removeElement, false);
    },
    close: function close(target) {
      if (target) {
        Dismiss.remove(target);
        target.classList.toggle(ClassName.FADE);
      }
    }
  };

  Event.addListener("id", function (event) {
    event.preventDefault();

    var target = Event.target(event);

    Dismiss.close(target);
  });

  return Dismiss;
}();
(function (_) {
  var Dropdown = {
    element: document.querySelectorAll(".dropdown__toggle"),
    class: "dropdown__list--visible",

    init: function init() {
      Dropdown.bind();
    },
    hide: function hide(el) {
      var active = document.querySelector('#' + el.getAttribute("data-dropdown"));
      var target = document.querySelector('.' + Dropdown.class);
      if (target && target != active) target.classList.remove(Dropdown.class);
    },
    toggle: function toggle(e, el) {
      e.preventDefault();

      var target = document.querySelector('#' + el.getAttribute("data-dropdown"));
      if (target) target.classList.toggle(Dropdown.class);
    },
    bind: function bind() {
      Dropdown.element.forEach(function (el) {
        el.addEventListener("click", function (e) {
          return Dropdown.toggle(e, el);
        });
        el.addEventListener("mouseenter", function (e) {
          return Dropdown.hide(el);
        });
      });
    }
  };

  Dropdown.init();
})();
var Modal = function (_) {
  var ClassName = {
    OPEN: "modal--open"
  };

  var Modal = {
    close: function close() {
      var oldModal = document.querySelector('.' + ClassName.OPEN);

      if (oldModal) oldModal.classList.remove(ClassName.OPEN);
    },
    open: function open(target) {
      Modal.close();

      if (target && !target.classList.contains(ClassName.OPEN)) {
        target.classList.add(ClassName.OPEN);
      }
    }
  };

  Event.addListener("modal", function (event) {
    event.preventDefault();

    var target = Event.target(event);

    Modal.open(target);
  });

  return Modal;
}();