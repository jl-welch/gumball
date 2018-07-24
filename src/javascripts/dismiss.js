const Dismiss = (_ => {
  const Selector = {
    ALERT: "alert"
  }

  const ClassName = {
    FADE: "fade-out",
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
      if (target) {
        Dismiss.remove(target);
        target.classList.toggle(ClassName.FADE);
      }
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
  
  return Dismiss;
})();