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
const $ = (selector) => {
    let correctSelector;
    try {
        correctSelector = document.querySelector(selector);
    }
    catch (error) {
        correctSelector = selector.element || selector;
    }
    const self = {
        element: correctSelector,
        on: (event, callback) => {
            self.element.addEventListener(event, callback);
        },
        log: () => console.log("Element: ", self.element),
        create: (appendToDoc) => {
            const createdElement = document.createElement(selector);
            if (appendToDoc)
                document.body.appendChild(createdElement);
            return createdElement;
        },
        HTML: (HTMLcode) => {
            self.element.innerHTML = HTMLcode;
        },
        addClass: (...classes) => {
            self.element.classList.add(...classes);
        },
        each: (callback) => {
            document.querySelectorAll(selector).forEach((element) => callback(element));
        },
        remove: async () => {
            self.element.remove();
        },
        contains: (otherElement) => {
            let correctOtherSelector;
            try {
                correctOtherSelector = document.querySelector(otherElement);
            }
            catch (error) {
                correctOtherSelector = otherElement.element || otherElement;
            }
            return self.element.contains(correctOtherSelector);
        }
    };
    return self;
};
export default $;
