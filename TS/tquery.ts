const $ = (selector: any) => {
    let correctSelector: any;
    try {
        correctSelector = document.querySelector(selector);
    } catch (error) {
        correctSelector = selector.element || selector;
    }
    let self = {
        element: correctSelector,
        on: (event: keyof DocumentEventMap, callback: any, options?: object) => {
            self.element.addEventListener(event, callback, options);
        },
        On: (events: Array<keyof DocumentEventMap>, callback: Function, options?: object) => {
            events.forEach((event: any) => {
                if ((event == "keypress") || (event == "keydown") || (event == "keyup")) self.element.addEventListener(event, (e: any) => { if (e.key == "Enter") callback(e) }, options); else self.element.addEventListener(event, callback, options);
            })
        },
        onGlobal: (event: any, callback: Function, options?: object) => {
            document.addEventListener(event, e => {
                if (e.target.matches(selector)) callback(e);
            }, options)
        },
        log: () => console.log("Element: ", self.element),
        create: (appendToDoc?: boolean) => {
            let createdElement = document.createElement(selector);
            if (appendToDoc) document.body.appendChild(createdElement);
            return createdElement;
        },
        append: (element: Element) => {
            self.element.append(element);
        },
        HTML: (HTMLcode?: any) => {
            if (!HTMLcode) return self.element.innerHTML;
            self.element.innerHTML = HTMLcode;
        },
        addClass: (...classes: Array<any>) => {
            self.element.classList.add(...classes)
        },
        removeClass: (...classes: Array<any>) => {
            self.element.classList.remove(...classes)
        },
        toggleClass: (...classes: Array<any>) => {
            self.element.classList.toggle(...classes)
        },
        value: correctSelector?.value,
        text: correctSelector?.innerText,
        css: correctSelector?.style,
        parent: correctSelector?.parentElement,
        all: () => {
            return [...document.querySelectorAll(selector)]
        },
        each: (callback: Function) => {
            document.querySelectorAll(selector).forEach((element) => callback(element));
        },
        remove: () => {
            self.element.remove();
        },
        contains: (otherElement: any) => {
            let correctOtherSelector;
            try {
                correctOtherSelector = document.querySelector(otherElement);
            }
            catch (error) {
                correctOtherSelector = otherElement.element || otherElement;
            }
            return self.element.contains(correctOtherSelector);
        },
    }
    return self;
}
export default $;