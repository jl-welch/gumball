const Target = (_ => {
  const Attribute = {
    TARGET: "data-target",
  }

  const Target = {
    query(event) {
      const element = event.target.closest(`[${Attribute.TARGET}]`);

      if (element) {
        const attribute = element.getAttribute(Attribute.TARGET),
              target    = document.querySelector(attribute);

        return target;
      }

      return null;
    },

    queryAncestor(event, className) {
      const element = event.target.closest(`.${className}`);
      return element ? element : null;
    }
  }

  return Target;
})();