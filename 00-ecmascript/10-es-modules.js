// --------------------------------------------------------------------------
// ES Modules

function shuffle(list) {
  let _ = [...list];
  for (let i = _.length - 1; i > 0; --i) {
    let k = Math.floor(Math.random() * (i + 1));
    [_[k], _[i]] = [_[i], _[k]];
  }
  return _;
}

function numberWithComma(n) {
  return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/* -------------------------------------------------------------------------- */

export function createElement(type, props, ...children) {
  return {
    key: Symbol('virtual-element'),
    type,
    props: { ...props, children },
  };
}

class VirtualDomRoot {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  #parseVNode(vNode) {
    const { type, props } = vNode;

    const element = document.createElement(type);

    const children = props.children;
    delete props.children;

    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') {
        element.classList.add(value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach((child) => {
      if (typeof child === 'string') {
        element.textContent = child;
      } else {
        element.append(this.#parseVNode(child));
      }
    });

    return element;
  }

  render(vNode) {
    const parsedElements = this.#parseVNode(vNode);
    this.rootElement.append(parsedElements);
  }

  umount() {
    Array.from(this.rootElement.children).forEach((child) => child.remove());
  }
}

export function createRoot(rootElement) {
  return new VirtualDomRoot(rootElement);
}
