const Modal = (_ => {
  const ClassName = {
    OPEN: "open"
  }

  const Modal = {
    close() {
      const active = document.querySelector(`.${ClassName.OPEN}`);
      if (active) active.classList.remove(ClassName.OPEN);
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