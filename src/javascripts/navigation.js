const Nav = {
  config: {
    nav:   document.querySelector("[data-navbar]"),
    class: "nav--active"
  },

  init() {
    Nav.bind();
  },

  toggle(e) {
    document.querySelector(`#${e.currentTarget.dataset.navbar}`)
    .classList.toggle(Nav.config.class);
  },

  bind() {
    if (Nav.config.nav) Nav.config.nav.addEventListener("click", e => Nav.toggle(e));
  }
}

Nav.init();