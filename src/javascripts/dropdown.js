(_ => {
  const Dropdown = {
    element: document.querySelectorAll(".dropdown__toggle"),
    class:   "dropdown__list--visible",
  
    init() {
      Dropdown.bind();
    },
  
    hide(el) {
      let active = document.querySelector(`#${el.getAttribute("data-dropdown")}`);
      let target = document.querySelector(`.${Dropdown.class}`);
      if (target && target != active) target.classList.remove(Dropdown.class);
    },
  
    toggle(e, el) {
      e.preventDefault();
  
      let target = document.querySelector(`#${el.getAttribute("data-dropdown")}`);
      if (target) target.classList.toggle(Dropdown.class);
    },
  
    bind() {
      Dropdown.element.forEach(el => {
        el.addEventListener("click", e => Dropdown.toggle(e, el));
        el.addEventListener("mouseenter", e => Dropdown.hide(el));
      });
    }
  }
  
  Dropdown.init();
})();