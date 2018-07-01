const Dropdown = {
  config: {
    dropdowns: document.querySelectorAll(".dropdown"),
    class:     "dropdown--visible"
  },

  init() {
    Dropdown.bind();
  },

  hide() {
    document.querySelector(`.${Dropdown.config.class}`).classList.remove(Dropdown.config.class);
  },

  toggle(e) {
    let target = e.target.parentNode;
    e.currentTarget.classList.toggle(className);
  },

  bind() {
    Dropdown.config.dropdowns.forEach(d => {
      d.addEventListener("click", e => Dropdown.toggle(e));
      d.addEventListener("mouseenter", e => Dropdown.hide(e));
    });
  }
}

Dropdown.init();