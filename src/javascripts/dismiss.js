const Dismiss = (_ => {
  const Selector = {
    ALERT: "alert"
  }

  const ClassName = {
    FADE: "fade-out",
    OPEN: "open"
  }

  const Dismiss = {
    remove(target) {

      function removeElement() {
        target.remove();
        target.removeEventListener("transitionend", removeElement, false);
      }

      target.addEventListener("transitionend", removeElement, false);
    },
  
    close(target) {
      Dismiss.clear();

      if (target) {
        Dismiss.remove(target);
        target.classList.toggle(ClassName.FADE);
      }
    },

    clear() {
      const target = document.querySelector(`.${ClassName.OPEN}`);
      if (target) target.classList.remove(ClassName.OPEN);
    }
  }

  Event.addListener("alert", event => {
    event.preventDefault();

    const target = Target.queryAncestor(Selector.ALERT);

    Dismiss.close(target);
  });

  Event.addListener("selector", event => {
    event.preventDefault();
    
    const target = Target.query(event);

    Dismiss.close(target);
  });

  Event.addListener("clear", event => {
    const target = Target.queryAncestor(event, ClassName.OPEN);

    if (!target) Dismiss.clear();
  });
  
  return Dismiss;
})();