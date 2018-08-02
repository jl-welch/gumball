const Modal = (_ => {
  const ClassName = {
    OPEN: "open"
  }

  const Attribute = {
    HIDDEN: "aria-hidden"
  }

  const Modal = {
    close() {
      const target = document.querySelector(`.${ClassName.OPEN}`);
      if (target) {
        target.classList.remove(ClassName.OPEN);
        Modal.addHiddenAttr(target);
      }
    },

    addHiddenAttr(element) {
      element.setAttribute(Attribute.HIDDEN, "true");
    },

    removeHiddenAttr(element) {
      element.removeAttribute(Attribute.HIDDEN);
    },
  
    open(target) {
      Modal.close();

      if (target && !target.classList.contains(ClassName.OPEN)) {
        target.classList.add(ClassName.OPEN);
        Modal.removeHiddenAttr(target);
      }
    }
  }

  Event.addListener("modal", event => {
    event.preventDefault();
    
    const target = Target.query(event);

    Modal.open(target);
  });

  return Modal;
})();