import matches from "./el-matches";

function closest(element, string) {
  do {
    if (matches(element, string)) return element;
    // eslint-disable-next-line no-param-reassign
    element = element.parentElement || element.parentNode;
  } while (element !== null && element.nodeType === 1);

  return null;
}

export default closest;
