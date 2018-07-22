const Event = (_ => {

  const Attribute = {
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
            element   = event.target.closest(`[${Attribute.EVENT}]`) ||
                        event.target.closest(`[${Attribute.CLOSE}]`),
            action    = element ? element.getAttribute(Attribute.EVENT) || 
                                  element.getAttribute(Attribute.CLOSE) : null;

      if (listeners[action]) listeners[action](event);
    }
  }

  return Event;
})();

document.documentElement.addEventListener("click", Event.action, false);