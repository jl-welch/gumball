const Nav = {
  element: document.querySelector("[data-navbar]"),
  class:   "nav--active",

  init() {
    Nav.bind();
  },

  toggle(e) {
    document.querySelector(`#${e.currentTarget.dataset.navbar}`)
    .classList.toggle(Nav.class);
  },

  bind() {
    if (Nav.nav) Nav.nav.addEventListener("click", e => Nav.toggle(e));
  }
}

Nav.init();