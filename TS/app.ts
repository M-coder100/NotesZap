/* ====================================
*  NotesZap ~ Notes taking, redesigned.
*  -- -- -- -- BETA 0.4v -- -- -- -- -- 
* =====================================
*/

import $ from "./tquery.js";
import NoteEditor from "./noteEditor.js";
import { renderNotes, refreshNotes } from "./notes.js";
import popup from "./popup.js";
import { arraySearch } from "./utils.js";

if (!localStorage.getItem("Notes")) {
    new popup(`
    <nav class="topBar">
        <ion-icon name="close-outline" id="CLOSE" tabindex="0"></ion-icon>
        <span style="color: white;">Notes<span style="font-weight: 800;">Zap</span> ( BETA 0.2 )</span>
    </nav>
    <div class="main">
        <img src="src/Logo.svg" class="logo"/>
        <div class="desc">
            <h1 class="header">Notes taking, <br>redesigned</h1>
            Welcome to the new era of notes taking. Make more notes beautiful than ever and help yourself to remember things faster and better.
            <button id="CLOSE">Get Started</button>
        </div>
    </div>
    `)
} else $`.popupContainer`.remove();
const sorts = {
    sortType: $`#SORT_BY`.element,
    noteType: $`#NOTE_TYPE`.element,
    viewType: $`#VIEW_TYPE`.element 
}
let getfullDate = () => `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
const device = (() => window.innerWidth <= 550 ? "mobile" : "desktop")();
console.log(device);

const d = new Date();
$`#SEARCH`.on("input", () => {
    if ($`#SEARCH`.value && localStorage.getItem("Notes")) {
        $`note`?.each((element: Element) => element.remove())
        renderNotes(arraySearch($`#SEARCH`.value, JSON.parse(localStorage.getItem("Notes") || "{}")))
    } else refreshNotes();
})

$(document).on("keyup", (key: KeyboardEvent) => {
    if (((key.key == "+") || (key.key == "=")) && ($`.noteEditor`.all().length == 0)) {
        new NoteEditor("Create", sorts.noteType.value);
        $`.noteEditor`.addClass("active");
    }
    else if (key.key == "Escape" && $`.noteEditor`.all().length > 0) $`.noteEditor.active`.remove();
})
$("#ADD_NEW_NOTE_BUTTON").On(["click", "keyup"], () => {    
    if (($`.noteEditor`.all().length <= 2)) {
        new NoteEditor("Create", sorts.noteType.value)
    } else {
        alert("Maximum create note editors reached.")
    }
}, true)

let rotation: number = 360;
$`.refreshNotesBtn`.On(["click", "keyup"], () => {
    $`.refreshNotesBtn`.css.transform = `rotate(${rotation}deg)`;
    rotation += 360;
    refreshNotes();
}, true)

$(document).on("click", () => {
    if ($(document).contains(".noteEditor")) {
        $`.noteEditor`.each((element: Element) => {
            $(element).on("mousedown", () => {
                $`.noteEditor`.each((element: Element) => {
                    $(element).removeClass("active");
                })
                element.classList.add("active");
            })
        })
    }
})
export { getfullDate, device }