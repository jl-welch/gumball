class Event {
  constructor(selector) {
    this.Selector  = selector;
    this.listeners = {};

    document.documentElement.addEventListener("click", this.emit.bind(this), false);
  }

  addListener(name, callback) {
    this.listeners[name] = callback;
  }

  emit(event) {
    let element, action = false;
    
    element = event.target.closest(`[${this.Selector}]`);

    action = element ? element.getAttribute(this.Selector) : "clear";

    if (this.listeners[action]) this.listeners[action](event);
  }
}