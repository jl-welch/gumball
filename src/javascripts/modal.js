const Modal = (_ => {
  const ClassName = {
    OPEN: "modal--open"
  }

  const Modal = {
    close() {
      const oldModal = document.querySelector(`.${ClassName.OPEN}`);

      if (oldModal) oldModal.classList.remove(ClassName.OPEN);
    },
  
    open(target) {
      Modal.close();

      if (target && !target.classList.contains(ClassName.OPEN)) {
        target.classList.add(ClassName.OPEN);
      }
    },
  }

  Event.addListener("modal", event => {
    event.preventDefault();
    
    const target = Target.query(event);

    Modal.open(target);
  });

  return Modal;
})();