const Dropdown = {
  config: {
    dropdowns: document.querySelectorAll(".dropdown"),
    class:     "dropdown--visible"
  },

  init() {
    Dropdown.bind();
  },

  hide(e) {
    let dd = document.querySelector(`.${Dropdown.config.class}`);
    if (dd && dd != e.currentTarget) dd.classList.remove(Dropdown.config.class);
  },

  toggle(e) {
    e.currentTarget.classList.toggle(Dropdown.config.class);
  },

  bind() {
    Dropdown.config.dropdowns.forEach(d => {
      d.addEventListener("click", e => Dropdown.toggle(e));
      d.addEventListener("mouseenter", e => Dropdown.hide(e));
    });
  }
}

Dropdown.init();