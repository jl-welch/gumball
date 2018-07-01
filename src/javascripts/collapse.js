const Collapse = {
  config: {
    collapse:   document.querySelectorAll("[data-collapse]"),
    duration:   (30 / 100) * 60,
    collapsing: false
  },
  
  init() {
    Collapse.bindCollapse();
  },

  ancestor(e) {
    for (; e && e !== document; e = e.parentNode) {
      if (e.matches(".collapse")) return e;
    }
  },

  easeInOut(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  },

  setHeight(e, v) {
    e.style.height = `${v}px`;
  },

  animate(el, from, to, time, change, ancestor) {
    ++time;

    let value = Collapse.easeInOut(time, from, change, Collapse.config.duration);

    Collapse.setHeight(el, value);

    if (time < Collapse.config.duration) {
      requestAnimationFrame(_ => {
        Collapse.animate(el, from, to, time, change, ancestor);
      });
    } else {
      Collapse.setHeight(el, to);
      if (!ancestor) Collapse.config.collapsing = false;
    }
  },

  collapse(e, f, t, c) {
    Collapse.config.collapsing = true;

    let change    = t - f,
        time      = 0,
        ancestor  = Collapse.ancestor(e.parentNode);

    if (ancestor && c) {
      let ancestorHeight = ancestor.offsetHeight;
      c(ancestor, ancestorHeight, t + ancestorHeight - f, Collapse.collapse);
    }

    Collapse.animate(e, f, t, time, change, ancestor);
  },

  getAria(e) {
    return e.getAttribute("aria-expanded");
  },

  setAria(e) {
    let a = Collapse.getAria(e) === "false" ? "true" : "false";
    e.setAttribute("aria-expanded", a);

    return a;
  },

  hideOnLoad(c, e) {
    let a = Collapse.getAria(c);
    if (a == 'false') e.style.height = "0px";
    e.style.overflow = "hidden";
  },

  bindCollapse() {
    Collapse.config.collapse.forEach(c => {
      let el = document.querySelector(`#${c.dataset.collapse}`);
      Collapse.hideOnLoad(c, el);

      c.addEventListener("click", e => {
        let a = Collapse.setAria(c),
            elHeight = el.scrollHeight,
            elCurrentHeight = el.offsetHeight;
  
        if (!Collapse.config.collapsing) {
          Collapse.collapse(el, elCurrentHeight, elHeight - elCurrentHeight, Collapse.collapse);
        }
      });
    });
  }
}

Collapse.init();