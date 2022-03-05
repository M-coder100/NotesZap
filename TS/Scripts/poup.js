import $ from "./tquery.js";
export default class popup {
    constructor(markUp, type) {
        const div = $ `div`.create(false);
        div.classList.add("popup");
        div.innerHTML = markUp;
        $ `.popupContainer`.append(div);
        $ `#CLOSE`.each((element) => element.onclick = () => $ `.popupContainer`.remove());
    }
}
