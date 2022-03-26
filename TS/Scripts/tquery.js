const $ = (selector) => {
    let correctSelector;
    try {
        correctSelector = document.querySelector(selector);
    }
    catch (error) {
        correctSelector = selector.element || selector;
    }
    let self = {
        element: correctSelector,
        on: (event, callback) => {
            self.element.addEventListener(event, callback);
        },
        On: (events, callback, checkKeyPress) => {
            events.forEach((event) => {
                if ((event == "keypress") || (event == "keydown") || (event == "keyup"))
                    self.element.addEventListener(event, (e) => { if (e.key == "Enter")
                        callback(e); });
                else
                    self.element.addEventListener(event, callback);
            });
        },
        onGlobal: (event, callback) => {
            document.addEventListener(event, e => {
                if (e.target.matches(selector))
                    callback(e);
            });
        },
        log: () => console.log("Element: ", self.element),
        create: (appendToDoc) => {
            let createdElement = document.createElement(selector);
            if (appendToDoc)
                document.body.appendChild(createdElement);
            return createdElement;
        },
        append: (element) => {
            self.element.append(element);
        },
        HTML: (HTMLcode) => {
            if (!HTMLcode)
                return self.element.innerHTML;
            self.element.innerHTML = HTMLcode;
        },
        addClass: (...classes) => {
            self.element.classList.add(...classes);
        },
        removeClass: (...classes) => {
            self.element.classList.remove(...classes);
        },
        toggleClass: (...classes) => {
            self.element.classList.toggle(...classes);
        },
        value: correctSelector?.value,
        text: correctSelector?.innerText,
        css: correctSelector?.style,
        parent: correctSelector?.parentElement,
        all: () => {
            return [...document.querySelectorAll(selector)];
        },
        each: (callback) => {
            document.querySelectorAll(selector).forEach((element) => callback(element));
        },
        remove: () => {
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
        },
    };
    return self;
};
export default $;
