import { addNoteButton } from "./app.js";
import $ from "./tquery.js";
addNoteButton.on("click", () => {
    $ `.saveButton`.on("click", () => {
        let headerValue = $ `#HEADER_VALUE`.value;
        let noteValue = $ `.noteText`.text;
        if (headerValue.trim() || noteValue.trim()) {
            refreshNotes();
            $ `note:last-child`.addClass("new");
        }
    });
});
function renderNotes(notes) {
    if (!notes || !notes[0]) {
        const msg = document.createElement("msg");
        $(msg).HTML(`<h1 id="NOTE_HEADER">No Notes Found</h1>Create your first note by clicking the add button or pressing the "+" key from your keyboard`);
        $ `#NOTES_CONTAINER`.append(msg);
    }
    notes.forEach((item) => {
        const note = document.createElement("note");
        const classes = [
            item.Checked ? "checked" : "",
            item.Pinned ? "pinned" : ""
        ];
        note.id = `${notes.indexOf(item)}`;
        classes[0] ? note.classList.add(classes[0]) : false;
        classes[1] ? note.classList.add(classes[1]) : false;
        $(note).HTML(`
            <div class="topBar">
                <div class="grp">
                    <div class="option" id="CHECK" title="Mark done"></div>
                    <div class="option" id="PIN" title="Pin to top"></div>
                    <div class="option" id="DELETE" title="Move to trash"></div>
                </div>
                <span id="TIME">Modified: ${item.TIME}</span>
            </div>
            <h1 id="NOTE_HEADER">${item.TITLE}</h1>
            <div class="wrper">
                <div class="divider"></div>
            </div>
            <div id="NOTE_TEXT">${item.NOTE}</div>
        `);
        $ `#NOTES_CONTAINER`.append(note);
    });
}
renderNotes(JSON.parse(localStorage.getItem("Notes")));
function refreshNotes() {
    if ($ `#NOTES_CONTAINER msg`.element)
        $(`#NOTES_CONTAINER msg`).remove();
    $ `note`?.each((element) => element.remove());
    renderNotes(JSON.parse(localStorage.getItem("Notes")));
    noteControl();
}
function noteControl() {
    if (!!document.querySelector("note")) {
        $ `note`.each((element) => {
            $(".topBar .option").each((option) => {
                option.addEventListener("click", () => {
                    (function takeActionForTheNote(opt, index) {
                        if (opt == "DELETE") {
                            deleteNote(index);
                            refreshNotes();
                        }
                        ;
                    })(option.id, element.id);
                });
            });
        });
    }
    function deleteNote(index) {
        let notes = JSON.parse(localStorage.getItem("Notes"));
        let i = Number(index);
        notes.splice(i, 1);
        console.log("executed:", i);
        localStorage.setItem("Notes", JSON.stringify(notes));
    }
}
noteControl();
