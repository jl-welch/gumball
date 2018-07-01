const Modal = {
  config: {
    modal: document.querySelectorAll("[data-modal]"),
    close: document.querySelectorAll(".modal__close"),
    class: "modal--open"
  },

  init() {
    Modal.bindOpen();
    Modal.bindClose();
  },

  close() {
    let previousModal = document.querySelector(`.${Modal.config.class}`);
    if (previousModal) previousModal.classList.remove(`${Modal.config.class}`);
  },

  open(e, c) {
    e.preventDefault();

    Modal.close();

    document.querySelector(`#${c.dataset.modal}`)
    .classList.add(`${Modal.config.class}`);
  },

  bindOpen() {
    Modal.config.modal.forEach(c => 
      c.addEventListener("click", e => Modal.open(e, c)));
  },

  bindClose() {
    Modal.config.close.forEach(c => 
      c.addEventListener("click", e => Modal.close()));
  }
}

Modal.init();