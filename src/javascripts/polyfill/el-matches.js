function selectorMatches(element, selector) {
  const proto = Element.prototype;
  const func =
    proto.matches ||
    proto.webkitMatchesSelector ||
    proto.mozMatchesSelector ||
    proto.msMatchesSelector;
  return func.call(element, selector);
}

export default selectorMatches;
