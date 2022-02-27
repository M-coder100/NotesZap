import $ from "./tquery.js";
import NoteEditor from "./noteEditor.js";

const addNoteButton = $("#ADD_NEW_NOTE_BUTTON");
const sorts = {
    sortType: $`#SORT_BY`.element,
    noteType: $`#NOTE_TYPE`.element,
    viewType: $`#VIEW_TYPE`.element
}

const d = new Date();
var getfullDate = () => `${d.getDay()+2}/${d.getDate()}/${d.getFullYear()}`;

$(document).on("keyup", (key: KeyboardEvent) => {
    
    if (((key.key == "+") || (key.key == "=")) && (document.querySelectorAll(".noteEditor").length == 0)) {
        new NoteEditor("Create", sorts.noteType.value);
        $`.noteEditor`.addClass("active");
    }
    if (key.key == "Escape") $`.noteEditor.active`.remove();
})
$(addNoteButton).on("click", () => {
    if (document.querySelectorAll(".noteEditor").length <= 1) {
        new NoteEditor("Create", sorts.noteType.value)
        $`.noteEditor`.addClass("active");
    } else {
        alert("Maximum create note editors reached.")
    }
})

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
export { getfullDate, addNoteButton }