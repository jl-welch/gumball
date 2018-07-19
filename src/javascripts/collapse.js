(_ => {
  const Collapse = {
    element:    document.querySelectorAll("[data-collapse]"),
    duration:   (30 / 100) * 60,
    collapsing: false,
  
    init() {
      Collapse.bind();
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
        el.style.height = to <= 1 ? "0" : "auto";
        if (!ancestor) Collapse.collapsing = false;
      }
    },
  
    toggle(el, from, to, cb) {
      Collapse.collapsing = true;
  
      let change = to - from,
          ancestor = Collapse.ancestor(el.parentNode);
  
      if (ancestor && cb) {
        let height = ancestor.offsetHeight;
        cb(ancestor, height, to + height - from, Collapse.toggle);
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
  
    hideOnLoad(el, target) {
      let aria = Collapse.getAria(el);
      if (aria == 'false') target.style.height = "0px";
      target.style.overflow = "hidden";
    },
  
    addEvent(el, target) {
      el.addEventListener("click", e => {
        e.preventDefault();
  
        Collapse.setAria(el);
  
        let sHeight = target.scrollHeight,
            oHeight = target.offsetHeight;
  
        if (!Collapse.collapsing) Collapse.toggle(target, oHeight, sHeight - oHeight, Collapse.toggle);
      });
    },
  
    bind() {
      Collapse.element.forEach(el => {
        let target = document.querySelector(`#${el.getAttribute("data-collapse")}`);
        if (!target) return;
  
        Collapse.hideOnLoad(el, target);
        Collapse.addEvent(el, target);
      });
    }
  }
  
  Collapse.init();
})();