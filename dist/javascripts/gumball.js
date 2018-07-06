"use strict";

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

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
    el.style.height = Collapse.ease(++time, from, change, Collapse.duration) + "px";

    if (time < Collapse.duration) {
      requestAnimationFrame(function (_) {
        return Collapse.animate(el, from, to, change, ancestor, time);
      });
    } else {
      el.style.height = to === 0 ? "0px" : "100%";
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
      var target = document.querySelector("#" + el.dataset.collapse);
      if (!target) return;

      Collapse.hideOnLoad(el, target);
      Collapse.addEvent(el, target);
    });
  }
};

Collapse.init();
var Dropdown = {
  element: document.querySelectorAll(".dropdown"),
  class: "dropdown--visible",

  init: function init() {
    Dropdown.bind();
  },
  hide: function hide(e) {
    var el = document.querySelector("." + Dropdown.class);
    if (el && el != e.currentTarget) el.classList.remove(Dropdown.class);
  },
  toggle: function toggle(e) {
    e.currentTarget.classList.toggle(Dropdown.class);
  },
  bind: function bind() {
    Dropdown.element.forEach(function (el) {
      el.addEventListener("click", function (e) {
        return Dropdown.toggle(e);
      });
      el.addEventListener("mouseenter", function (e) {
        return Dropdown.hide(e);
      });
    });
  }
};

Dropdown.init();
var Modal = {
  element: document.querySelectorAll("[data-modal]"),
  dismiss: document.querySelectorAll("[data-dismiss=\"modal\"]"),
  class: "modal--open",

  init: function init() {
    Modal.bindOpen();
    Modal.bindClose();
  },
  close: function close() {
    var el = document.querySelector("." + Modal.class);
    if (el) el.classList.remove(Modal.class);
  },
  open: function open(e, el) {
    e.preventDefault();

    Modal.close();

    document.querySelector("#" + el.dataset.modal).classList.add(Modal.class);
  },
  bindOpen: function bindOpen() {
    Modal.element.forEach(function (el) {
      return el.addEventListener("click", function (e) {
        return Modal.open(e, el);
      });
    });
  },
  bindClose: function bindClose() {
    Modal.dismiss.forEach(function (el) {
      return el.addEventListener("click", function (_) {
        return Modal.close();
      });
    });
  }
};

Modal.init();
var Nav = {
  element: document.querySelector("[data-nav]"),
  class: "nav--active",

  init: function init() {
    Nav.bind();
  },
  toggle: function toggle(e) {
    document.querySelector("#" + e.currentTarget.dataset.nav).classList.toggle(Nav.class);
  },
  bind: function bind() {
    if (Nav.element) Nav.element.addEventListener("click", function (e) {
      return Nav.toggle(e);
    });
  }
};

Nav.init();