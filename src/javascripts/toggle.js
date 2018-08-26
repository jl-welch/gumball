const Toggle = (_ => {
  const ClassName = {
    SHOW: "show"
  }

  const Aria = {
    HIDDEN: "aria-hidden"
  }

  const ModalMethods = {
    close() {
      const element = document.querySelector(`.${ClassName.SHOW}`);
      if (element) {
        element.classList.remove(ClassName.SHOW);
        ModalMethods.addAriaHidden(element);
      }
    },

    addAriaHidden(element) {
      element.setAttribute(Aria.HIDDEN, "true");
    },

    removeAriaHidden(element) {
      element.removeAttribute(Aria.HIDDEN);
    },
  
    open(element) {
      ModalMethods.close();

      if (element && !element.classList.contains(ClassName.SHOW)) {
        element.classList.add(ClassName.SHOW);
        ModalMethods.removeAriaHidden(element);
      }
    }
  }

  const DropdownMethods = {
    close(element) {
      element.classList.remove(ClassName.SHOW);
    },
  
    open(target, current) {
      if (!current) target.classList.add(ClassName.SHOW);
    }
  }

  const ToggleEvent = new Event("data-toggle");

  ToggleEvent.addListener("dropdown", event => {
    const element  = Target.query(event);

    if (element) {
      const current = element.classList.contains(ClassName.SHOW);
      DropdownMethods.close(element);
      DropdownMethods.open(element, current);
    }
  });

  ToggleEvent.addListener("modal", event => {
    event.preventDefault();
    
    const element = Target.query(event);

    ModalMethods.open(element);
  });
})();