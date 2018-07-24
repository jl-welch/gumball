const Dropdown = (_ => {
  const ClassName = {
    OPEN: "open"
  }

  const Dropdown = {
    close() {
      let active = document.querySelector(`.${ClassName.OPEN}`);
      if (active) active.classList.remove(ClassName.OPEN);
    },
  
    toggle(target, current) {
      if (!current) target.classList.add(ClassName.OPEN);
    }
  }

  Event.addListener("dropdown", event => {
    event.preventDefault();

    const target  = Target.query(event);
    if (target) {
      const current = target.classList.contains(ClassName.OPEN);
      Dropdown.close();
      Dropdown.toggle(target, current);
    }
  });
  
  return Dropdown;
})();