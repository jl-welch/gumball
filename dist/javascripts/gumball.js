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
  config: {
    collapse: document.querySelectorAll("[data-collapse]"),
    duration: 30 / 100 * 60,
    collapsing: false
  },

  init: function init() {
    Collapse.bindCollapse();
  },
  ancestor: function ancestor(e) {
    for (; e && e !== document; e = e.parentNode) {
      if (e.matches(".collapse")) return e;
    }
  },
  easeInOut: function easeInOut(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  },
  setHeight: function setHeight(e, v) {
    e.style.height = v + "px";
  },
  animate: function animate(el, from, to, time, change, ancestor) {
    ++time;

    var value = Collapse.easeInOut(time, from, change, Collapse.config.duration);

    Collapse.setHeight(el, value);

    if (time < Collapse.config.duration) {
      requestAnimationFrame(function (_) {
        Collapse.animate(el, from, to, time, change, ancestor);
      });
    } else {
      Collapse.setHeight(el, to);
      if (!ancestor) Collapse.config.collapsing = false;
    }
  },
  collapse: function collapse(e, f, t, c) {
    Collapse.config.collapsing = true;

    var change = t - f,
        time = 0,
        ancestor = Collapse.ancestor(e.parentNode);

    if (ancestor && c) {
      var ancestorHeight = ancestor.offsetHeight;
      c(ancestor, ancestorHeight, t + ancestorHeight - f, Collapse.collapse);
    }

    Collapse.animate(e, f, t, time, change, ancestor);
  },
  getAria: function getAria(e) {
    return e.getAttribute("aria-expanded");
  },
  setAria: function setAria(e) {
    var a = Collapse.getAria(e) === "false" ? "true" : "false";
    e.setAttribute("aria-expanded", a);

    return a;
  },
  hideOnLoad: function hideOnLoad(c, e) {
    var a = Collapse.getAria(c);
    if (a == 'false') e.style.height = "0px";
    e.style.overflow = "hidden";
  },
  bindCollapse: function bindCollapse() {
    Collapse.config.collapse.forEach(function (c) {
      var el = document.querySelector("#" + c.dataset.collapse);
      Collapse.hideOnLoad(c, el);

      c.addEventListener("click", function (e) {
        var a = Collapse.setAria(c),
            elHeight = el.scrollHeight,
            elCurrentHeight = el.offsetHeight;

        if (!Collapse.config.collapsing) {
          Collapse.collapse(el, elCurrentHeight, elHeight - elCurrentHeight, Collapse.collapse);
        }
      });
    });
  }
};

Collapse.init();
var Dropdown = {
  config: {
    dropdowns: document.querySelectorAll(".dropdown"),
    class: "dropdown--visible"
  },

  init: function init() {
    Dropdown.bind();
  },
  hide: function hide() {
    document.querySelector("." + Dropdown.config.class).classList.remove(Dropdown.config.class);
  },
  toggle: function toggle(e) {
    var target = e.target.parentNode;
    e.currentTarget.classList.toggle(className);
  },
  bind: function bind() {
    Dropdown.config.dropdowns.forEach(function (d) {
      d.addEventListener("click", function (e) {
        return Dropdown.toggle(e);
      });
      d.addEventListener("mouseenter", function (e) {
        return Dropdown.hide(e);
      });
    });
  }
};

Dropdown.init();
var Modal = {
  config: {
    modal: document.querySelectorAll("[data-modal]"),
    close: document.querySelectorAll(".modal__close"),
    class: "modal--open"
  },

  init: function init() {
    Modal.bindOpen();
    Modal.bindClose();
  },
  close: function close() {
    var previousModal = document.querySelector("." + Modal.config.class);
    if (previousModal) previousModal.classList.remove("" + Modal.config.class);
  },
  open: function open(e, c) {
    e.preventDefault();

    Modal.close();

    document.querySelector("#" + c.dataset.modal).classList.add("" + Modal.config.class);
  },
  bindOpen: function bindOpen() {
    Modal.config.modal.forEach(function (c) {
      return c.addEventListener("click", function (e) {
        return Modal.open(e, c);
      });
    });
  },
  bindClose: function bindClose() {
    Modal.config.close.forEach(function (c) {
      return c.addEventListener("click", function (e) {
        return Modal.close();
      });
    });
  }
};

Modal.init();
var Nav = {
  config: {
    nav: document.querySelector("[data-navbar]"),
    class: "nav--active"
  },

  init: function init() {
    Nav.bind();
  },
  toggle: function toggle(e) {
    document.querySelector("#" + e.currentTarget.dataset.navbar).classList.toggle(Nav.config.class);
  },
  bind: function bind() {
    if (Nav.config.nav) Nav.config.nav.addEventListener("click", function (e) {
      return Nav.toggle(e);
    });
  }
};

Nav.init();