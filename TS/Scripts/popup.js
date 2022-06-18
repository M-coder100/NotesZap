import $ from "./tquery.js";
import { intro } from "./utils.js";
export default class popup {
    constructor(markUp, type) {
        if (type == "dialog") {
            const div = $ `div`.create(false);
            div.classList.add("dialog");
            div.innerHTML = markUp;
            const container = $ `div`.create(true);
            container.classList.add("popupContainer");
            container.append(div);
        }
        else {
            const div = $ `div`.create(false);
            div.classList.add("popup");
            div.innerHTML = markUp;
            $ `.popupContainer`.append(div);
            $ `#CLOSE`.each((element) => element.onclick = () => {
                $ `.popupContainer`.remove();
                intro()?.onbeforeexit(() => {
                    intro().addHints();
                    $ `.introjs-hint`.css.zIndex = 2;
                })?.start();
            });
        }
    }
}
