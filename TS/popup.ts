import $ from "./tquery.js";
import { intro } from "./utils.js";

export default class popup {
    constructor(markUp: string, type?: string) {
        if (type == "dialog") {
            const div: HTMLElement = $`div`.create(false);
            div.classList.add("dialog")
            div.innerHTML = markUp;
            const container: HTMLElement = $`div`.create(true);
            container.classList.add("popupContainer");
            container.append(div);
        } else {
            const div: HTMLElement = $`div`.create(false);
            div.classList.add("popup")
            div.innerHTML = markUp;
            $`.popupContainer`.append(div)
            $`#CLOSE`.each((element: HTMLElement) => element.onclick = () => { 
                $`.popupContainer`.remove(); 
                intro()?.onbeforeexit(() => {
                    intro().addHints();
                    $`.introjs-hint`.css.zIndex = 2;
                })?.start();
            });
        }
    }
}