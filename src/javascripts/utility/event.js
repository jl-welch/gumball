const Event = (_ => {

  const Attributes = {
    EVENT:  "data-event",
    TARGET: "data-target",
    CLOSE:  "data-dismiss"
  }
	
  const Event = {
    listeners: {},

    // Add custom method to listeners
    addListener(name, cb) {
      Event.listeners[name] = cb;
    },

    // Run action on element event
    // element.addEventListener("click", Event.action, false)
    action(event) {			
      const listeners = Event.listeners,
            element   = event.target.closest(`[${Attributes.EVENT}]`) ||
                        event.target.closest(`[${Attributes.CLOSE}]`),
            action    = element ? element.getAttribute(Attributes.EVENT) || 
                                  element.getAttribute(Attributes.CLOSE) : null;

      if (listeners[action]) listeners[action](event);
    },

    target(event) {
      const element = event.target.closest(`[${Attributes.TARGET}]`);

      if (element) {
        const attribute = element.getAttribute(Attributes.TARGET),
              target    = document.querySelector(`#${attribute}`);

        return target;
      }

      return null;
    }
  }

  return Event;
})();

document.documentElement.addEventListener("click", Event.action, false);