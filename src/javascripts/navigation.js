const Nav = {
  element: document.querySelector("[data-nav]"),
  class:   "nav--active",

  init() {
    Nav.bind();
  },

  toggle(e) {
    document.querySelector(`#${e.currentTarget.dataset.nav}`)
    .classList.toggle(Nav.class);
  },

  bind() {
    if (Nav.element) Nav.element.addEventListener("click", e => Nav.toggle(e));
  }
}

Nav.init();