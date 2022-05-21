import $ from "./tquery.js";
import { intro } from "./utils.js";
export default class popup {
    constructor(markUp, type) {
        const div = $ `div`.create(false);
        div.classList.add("popup");
        div.innerHTML = markUp;
        $ `.popupContainer`.append(div);
        $ `#CLOSE`.each((element) => element.onclick = () => {
            $ `.popupContainer`.remove();
            intro()?.onbeforeexit(() => {
                return intro().addHints();
            })?.start();
        });
    }
}
