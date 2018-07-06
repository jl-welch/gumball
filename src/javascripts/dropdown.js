const Dropdown = {
  element: document.querySelectorAll(".dropdown"),
  class:   "dropdown--visible",

  init() {
    Dropdown.bind();
  },

  hide(e) {
    let el = document.querySelector(`.${Dropdown.class}`);
    if (el && el != e.currentTarget) el.classList.remove(Dropdown.class);
  },

  toggle(e) {
    e.currentTarget.classList.toggle(Dropdown.class);
  },

  bind() {
    Dropdown.element.forEach(el => {
      el.addEventListener("click", e => Dropdown.toggle(e));
      el.addEventListener("mouseenter", e => Dropdown.hide(e));
    });
  }
}

Dropdown.init();