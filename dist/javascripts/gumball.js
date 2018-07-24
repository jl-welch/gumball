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

  var Attribute = {
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
          element = event.target.closest('[' + Attribute.EVENT + ']') || event.target.closest('[' + Attribute.CLOSE + ']'),
          action = element ? element.getAttribute(Attribute.EVENT) || element.getAttribute(Attribute.CLOSE) : "clear";

      if (listeners[action]) listeners[action](event);
    }
  };

  return Event;
}();

document.documentElement.addEventListener("click", Event.action, false);
var Target = function (_) {
  var Attribute = {
    TARGET: "data-target"
  };

  var Target = {
    query: function query(event) {
      var element = event.target.closest('[' + Attribute.TARGET + ']');

      if (element) {
        var attribute = element.getAttribute(Attribute.TARGET),
            target = document.querySelector(attribute);

        return target;
      }

      return null;
    },
    queryAncestor: function queryAncestor(className) {
      var element = event.target.closest('.' + className);
      return element;
    }
  };

  return Target;
}();
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
  var Selector = {
    ALERT: "alert"
  };

  var ClassName = {
    FADE: "fade-out",
    OPEN: "open"
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
      Dismiss.clear();

      if (target) {
        Dismiss.remove(target);
        target.classList.toggle(ClassName.FADE);
      }
    },
    clear: function clear() {
      var target = document.querySelector('.' + ClassName.OPEN);
      if (target) target.classList.remove(ClassName.OPEN);
    }
  };

  Event.addListener("alert", function (event) {
    event.preventDefault();

    var target = Target.queryAncestor(Selector.ALERT);

    Dismiss.close(target);
  });

  Event.addListener("selector", function (event) {
    event.preventDefault();

    var target = Target.query(event);

    Dismiss.close(target);
  });

  Event.addListener("clear", function (event) {
    Dismiss.clear();
  });

  return Dismiss;
}();
var Dropdown = function (_) {
  var ClassName = {
    OPEN: "open"
  };

  var Dropdown = {
    close: function close() {
      var active = document.querySelector('.' + ClassName.OPEN);
      if (active) active.classList.remove(ClassName.OPEN);
    },
    toggle: function toggle(target, current) {
      if (!current) target.classList.add(ClassName.OPEN);
    }
  };

  Event.addListener("dropdown", function (event) {
    event.preventDefault();

    var target = Target.query(event);
    if (target) {
      var current = target.classList.contains(ClassName.OPEN);
      Dropdown.close();
      Dropdown.toggle(target, current);
    }
  });

  return Dropdown;
}();
var Modal = function (_) {
  var ClassName = {
    OPEN: "open"
  };

  var Modal = {
    close: function close() {
      var active = document.querySelector('.' + ClassName.OPEN);
      if (active) active.classList.remove(ClassName.OPEN);
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

    var target = Target.query(event);

    Modal.open(target);
  });

  return Modal;
}();