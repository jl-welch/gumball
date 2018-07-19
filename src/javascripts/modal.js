(_ => {
  const Modal = {
    element: document.querySelectorAll("[data-modal]"),
    dismiss: document.querySelectorAll("[data-dismiss=\"modal\"]"),
    class:   "modal--open",
  
    init() {
      Modal.bindOpen();
      Modal.bindClose();
    },
  
    close() {
      let el = document.querySelector(`.${Modal.class}`);
      if (el) el.classList.remove(Modal.class);
    },
  
    open(e, el) {
      e.preventDefault();
  
      Modal.close();
  
      document.querySelector(`#${el.getAttribute("data-modal")}`)
      .classList.add(Modal.class);
    },
  
    bindOpen() {
      Modal.element.forEach(el => 
        el.addEventListener("click", e => Modal.open(e, el)));
    },
  
    bindClose() {
      Modal.dismiss.forEach(el => 
        el.addEventListener("click", _ => Modal.close()));
    }
  }
  
  Modal.init();
})();