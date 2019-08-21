export type DOMEventMap = Record<string, (e: Event) => void>;
export type CSSProperties = CSSStyleDeclaration | Record<string, any>

export interface ElementOptions<T extends keyof HTMLElementTagNameMap> {
    tag?: T;
    cssText?: string;
    styles?: CSSProperties;
    className?: string;
    id?: string;
    innerHTML?: string;
    innerText?: string;
    events?: DOMEventMap;
}

export const createElement = <T extends keyof HTMLElementTagNameMap = 'div'>(
  options: ElementOptions<T> = {},
  ...children: Array<HTMLElement>
) => {
    const element = document
      .createElement(
        options.tag || 'div',
      ) as HTMLElementTagNameMap[T];

    if (options.id) {
        element.id = options.id;
    }

    if (options.className) {
        element.classList.value = options.className;
    }

    if (options.cssText) {
        element.style.cssText = options.cssText;
    }

    if (options.styles) {
        setStyles(element, options.styles);
    }

    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }

    if (options.innerText) {
        element.innerText = options.innerText;
    }

    if (options.events) {
        setEvents(element, options.events);
    }

    for (const child of children) {
        element.appendChild(child);
    }

    return element;
};

export const setStyles = (element: HTMLElement, styles: CSSProperties) => {
  for (const style in styles) {
    if (!styles.hasOwnProperty(style)) {
      continue;
    }
    (element as any).style[style] = (styles as any)[style];
  }
  element.getBoundingClientRect()
};

export const setEvents = (element: HTMLElement, events: DOMEventMap) => {
  for (const eventName in events) {
    if (events.hasOwnProperty(eventName)) {
        continue;
    }
    (element as any)[eventName] = events[eventName];
  }
  element.getBoundingClientRect()
};

export const addClassNames = (
    el: HTMLElement, 
    classNames: string[]
) => {
    for (const className of classNames) {
        el.classList.add(className)
    }
    waitForElements(el)
}

export const removeClassNames = (
    el: HTMLElement, 
    classNames: string[]
) => {
    for (const className of classNames) {
        el.classList.remove(className)
    }
    waitForElements(el)
}

export const clearClassList = (
    el: HTMLElement
) => el && el.className && (el.className = '')

export const waitForElements = (...e: HTMLElement[]) => e.forEach(el => el.getBoundingClientRect())
