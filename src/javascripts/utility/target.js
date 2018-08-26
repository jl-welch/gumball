const Target = (_ => {
  const Selector = "data-target";

  const Target = {
    query(event) {
      const element = event.target.closest(`[${Selector}]`);

      if (element) {
        const attribute = element.getAttribute(Selector),
              target    = document.querySelector(attribute);

        return target;
      }

      return null;
    },

    queryAncestor(event, selector) {
      const element = event.target.closest(selector);
      return element ? element : null;
    }
  }

  return Target;
})();