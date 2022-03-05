import $ from "./tquery.js";

export default class popup {
    constructor(markUp: string, type?: string) {
        const div: HTMLElement = $`div`.create(false);
        div.classList.add("popup")
        div.innerHTML = markUp;
        $`.popupContainer`.append(div)
        $`#CLOSE`.each((element: HTMLElement) => element.onclick = () => $`.popupContainer`.remove());
    }
}