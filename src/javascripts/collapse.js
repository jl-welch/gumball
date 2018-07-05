const Collapse = {
  element:   document.querySelectorAll("[data-collapse]"),
  duration:   (30 / 100) * 60,
  collapsing: false,

  init() {
    Collapse.bindCollapse();
  },

  ancestor(el) {
    for (; el && el !== document; el = el.parentNode) {
      if (el.matches(".collapse")) return el;
    }
  },

  ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  },

  animate(el, from, to, change, ancestor, time) {
    el.style.height = `${Collapse.ease(++time, from, change, Collapse.duration)}px`;

    if (time < Collapse.duration) {
      requestAnimationFrame(_ => Collapse.animate(el, from, to, change, ancestor, time));
    } else {
      el.style.height = to === 0 ? "0px" : "100%";
      if (!ancestor) Collapse.collapsing = false;
    }
  },

  collapse(el, from, to, cb) {
    Collapse.collapsing = true;

    let change = to - from,
        ancestor = Collapse.ancestor(el.parentNode);

    if (ancestor && cb) {
      let height = ancestor.offsetHeight;
      cb(ancestor, height, to + height - from, Collapse.collapse);
    }

    Collapse.animate(el, from, to, change, ancestor, 0);
  },

  getAria(el) {
    return el.getAttribute("aria-expanded");
  },

  setAria(el) {
    let a = Collapse.getAria(el) === "false" ? "true" : "false";
    el.setAttribute("aria-expanded", a);

    return a;
  },

  hideOnLoad(c, el) {
    let aria = Collapse.getAria(c);
    if (aria == 'false') el.style.height = "0px";
    el.style.overflow = "hidden";
  },

  bindCollapse() {
    Collapse.element.forEach(c => {
      let el = document.querySelector(`#${c.dataset.collapse}`);
      Collapse.hideOnLoad(c, el);

      c.addEventListener("click", e => {
        Collapse.setAria(c);

        let sHeight = el.scrollHeight,
            oHeight = el.offsetHeight;
  
        if (!Collapse.collapsing) {
          Collapse.collapse(el, oHeight, sHeight - oHeight, Collapse.collapse);
        }
      });
    });
  }
}

Collapse.init();