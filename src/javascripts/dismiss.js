const Dismiss = (_ => {
  const ClassName = {
    FADE: "fade-out"
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

  Event.addListener("id", event => {
    event.preventDefault();
    
    const target = Event.target(event);

    Dismiss.close(target);
  });
  
  return Dismiss;
})();