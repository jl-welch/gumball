const Dismiss = (_ => {
  const Selector = {
    MODAL: "modal",
    ALERT: "alert",
    TOGGLE: "data-toggle"
  }

  const ClassName = {
    SHOW: "show",
    FADE: "fade-out"
  }

  const DismissMethods = {
    // Temporarily remove show class causing item to be visible
    clear(selector) {
      const element = document.querySelector(selector);
      if (element) element.classList.remove(ClassName.SHOW);
    },

    // Remove element from the DOM
    removeElement(element) {
      function removeEvent() {
        // remove: see polyfill/remove.js
        element.remove();
        element.removeEventListener("transitionend", removeEvent, false);
      }

      element.addEventListener("transitionend", removeEvent, false);
      element.classList.add(ClassName.FADE);
    }
  }

  const DismissEvent = new Event("data-dismiss");

  DismissEvent.addListener("alert", event => {
    event.preventDefault();

    DismissMethods.clear(`.${ClassName.SHOW}`);

    const element = Target.queryAncestor(event, `.${Selector.ALERT}`);

    if (element) DismissMethods.removeElement(element);
  });

  // This listener will be run if the user doesn't click on an event element
  // Removing the currently visible show element
  DismissEvent.addListener("clear", event => {
    // Look up the list of parents and check to see if we are inside a shown element
    // This will prevent for example a dropdown closing if you click an element inside
    const ancestorIsShown    = Target.queryAncestor(event, `.${ClassName.SHOW}`);
    if (!ancestorIsShown) {
      const toggleIsClicked = Target.queryAncestor(event, `[${Selector.TOGGLE}]`);
      if (toggleIsClicked === null) DismissMethods.clear(`.${ClassName.SHOW}`);
    }
  });

  DismissEvent.addListener("modal", event => {
    event.preventDefault();

    DismissMethods.clear(`.${Selector.MODAL}.${ClassName.SHOW}`);
  });

  DismissEvent.addListener("selector", event => {
    event.preventDefault();

    DismissMethods.clear(`.${ClassName.SHOW}`);

    const element = Target.query(event);

    if (element) DismissMethods.removeElement(element);
  });

  return DismissEvent;
})();

