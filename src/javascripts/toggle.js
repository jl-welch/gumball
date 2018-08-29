const Toggle = (_ => {
  const ClassName = {
    SHOW: "show"
  }

  const Aria = {
    HIDDEN: "aria-hidden"
  }

  const Modal = {
    close() {
      const element = document.querySelector(`.${ClassName.SHOW}`);
      if (element) {
        element.classList.remove(ClassName.SHOW);
        Modal.setAriaHidden(element);
      }
    },

    setAriaHidden(element) {
      element.setAttribute(Aria.HIDDEN, "true");
    },

    removeAriaHidden(element) {
      element.removeAttribute(Aria.HIDDEN);
    },
  
    open(element) {
      Modal.close();

      if (element && !element.classList.contains(ClassName.SHOW)) {
        element.classList.add(ClassName.SHOW);
        Modal.removeAriaHidden(element);
      }
    }
  }

  const Dropdown = {
    close(element) {
      element.classList.remove(ClassName.SHOW);
    },
  
    open(target, current) {
      if (!current) target.classList.add(ClassName.SHOW);
    }
  }

  const Collapse = {
    collapsing: false,
    duration:   24, // 400ms

    ease(time, from, change) {
      time /= Collapse.duration / 2;
      if (time < 1) return change / 2 * time * time + from;
      time--;
      return -change / 2 * (time * (time - 2) - 1) + from;
    },

    animate(el, from, to, change, ancestor, time) {
      el.style.height = `${Collapse.ease(++time, from, change)}px`;
  
      if (time < Collapse.duration) {
        requestAnimationFrame(_ => Collapse.animate(el, from, to, change, ancestor, time));
      } else {
        el.style.height = to <= 1 ? "0" : "auto";
        if (!ancestor) Collapse.collapsing = false;
      }
    },

    toggle(el, from, to, callback, ancestor) {
      Collapse.collapsing = true;
  
      let change = to - from;
  
      if (ancestor && callback) {
        let height = ancestor.offsetHeight;
        callback(ancestor, height, to + height - from, Collapse.toggle);
      }
  
      Collapse.animate(el, from, to, change, ancestor, 0);
    },

    getAriaExpanded(el) {
      return el.getAttribute("aria-expanded");
    },
  
    setAriaExpanded(el) {
      let a = Collapse.getAriaExpanded(el) === "false" ? "true" : "false";
      el.setAttribute("aria-expanded", a);
  
      return a;
    }
  }

  const ToggleEvent = new Event("data-toggle");

  ToggleEvent.addListener("collapse", event => {
    const element = Target.query(event);

    if (element) {
      Collapse.setAriaExpanded(element);

      let ancestor = Target.queryAncestor(event, `.collapse`);

      let sHeight = element.scrollHeight,
          oHeight = element.offsetHeight;

      if (!Collapse.collapsing) Collapse.toggle(element, oHeight, sHeight - oHeight, Collapse.toggle, ancestor);
    }
  });

  ToggleEvent.addListener("dropdown", event => {
    const element = Target.query(event);

    if (element) {
      const current = element.classList.contains(ClassName.SHOW);
      Dropdown.close(element);
      Dropdown.open(element, current);
    }
  });

  ToggleEvent.addListener("modal", event => {
    event.preventDefault();
    
    const element = Target.query(event);

    Modal.open(element);
  });
})();