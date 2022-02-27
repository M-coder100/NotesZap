// let $ = (element:string) => {
//     const self = {
//         HTMLelement: document.querySelector(element),
//         log: () => {
//             console.log(self.HTMLelement);
//         },
//         create: (appendToDoc:boolean) => {
//             const createdElement = document.createElement(element);
//             if (appendToDoc) document.appendChild(createdElement);
//             return createdElement;
//         }
//     }
//     return self.HTMLelement;
// }

const $ = (selector: any) => {
    let correctSelector;
    try {
        correctSelector = document.querySelector(selector);
    } catch (error) {
        correctSelector = selector.element || selector;
    }
    let self = {
        element: correctSelector,
        on: (event: any, callback: Function) => {
            self.element.addEventListener(event, callback);
        },
        onGlobal: (event: any, callback: Function) => {
            document.addEventListener(event, e => {
                if (e.target.matches(selector)) callback(e);
            })
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
        value: correctSelector?.value,
        text: correctSelector?.innerText,
        css: correctSelector?.style,
        all: () => { return document.querySelectorAll(selector) },
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