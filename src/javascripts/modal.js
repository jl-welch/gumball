const Modal = (_ => {
  const Selector = {
    TARGET: "[data-target]"
  }

  const ClassName = {
    OPEN: "modal--open"
  }

  const Modal = {
    close() {
      const oldModal = document.querySelector(`.${ClassName.OPEN}`);

      if (oldModal) oldModal.classList.remove(ClassName.OPEN);
    },
  
    open(target) {
      if (target && !target.classList.contains(ClassName.OPEN)) {
        Modal.close();
        target.classList.add(ClassName.OPEN);
      }
    },
  }

  Event.addListener("modal", event => {
    event.preventDefault();
    
    const target = Event.target(event);

    Modal.open(target);
  });

  return Modal;
})();