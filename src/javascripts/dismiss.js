(_ => {
  const Dismiss = {
    element: document.querySelectorAll("[data-dismiss]"),
    class:   "fade-out",
  
    init() {
      Dismiss.bind();
    },
  
    remove(el) {
      el.addEventListener("transitionend", _ => el.remove());
    },
  
    close(e, el) {
      e.preventDefault();
  
      let target = document.querySelector(`#${el.getAttribute("data-dismiss")}`);
      if (target) {
        Dismiss.remove(target);
        target.classList.add(Dismiss.class);
      }
    },
  
    bind() {
      Dismiss.element.forEach(el => {
        el.addEventListener("click", e => Dismiss.close(e, el));
      });
    }
  }
  
  Dismiss.init();
})();