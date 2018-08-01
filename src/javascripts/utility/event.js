const Event = (_ => {

  const Attribute = {
    EVENT:  "data-event",
    CLOSE:  "data-dismiss"
  }
	
  const Event = {
    listeners: {},

    addListener(name, cb) {
      Event.listeners[name] = cb;
    },

    action(event) {
      const listeners = Event.listeners;

      let element, action;

      // Check if the element we clicked on has one of the above data attributes
      for (let key in Attribute) {
        element = event.target.closest(`[${Attribute[key]}]`);
        // If they do, set action to the attribute value
        if (element) {
          action = element.getAttribute(Attribute[key]);
          break;
        }
      }
      
      // If what we click on is empty, run the clear listener
      // Clear removes .open class names
      if (!action) action = "clear";

      if (listeners[action]) listeners[action](event);
    }
  }

  return Event;
})();

document.documentElement.addEventListener("click", Event.action, false);