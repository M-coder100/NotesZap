import { addNoteButton } from "./app.js";
import NoteEditor from "./noteEditor.js";
import $ from "./tquery.js";

addNoteButton.on("click", () => {
    $`.saveButton`.on("click", () => {
        let headerValue = $`#HEADER_VALUE`.value;
        let noteValue = $`.noteText`.text;
        if (headerValue.trim() || noteValue.trim()) {
            refreshNotes();
            $`note:last-child`.addClass("new")
        }
    })
});
function renderNotes(notes: object[]) {
    if (!notes || !notes[0]) {
        const msg = document.createElement("msg");
        $(msg).HTML(`<h1 id="NOTE_HEADER">No Notes Found</h1>Create your first note by clicking the add button or pressing the "+" key from your keyboard`)
        $`#NOTES_CONTAINER`.append(msg)
        return;
    }
    // Main loop
    notes.forEach((item: any) => {
        // default
        const note = document.createElement("note");
        note.id = `${notes.indexOf(item)}`;
        if (item.Checked) {
            note.classList.add("checked")
        }
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
        `)
        $`#NOTES_CONTAINER`.append(note);
        // note options control
        (function noteControl() {
            document.querySelectorAll(`note[id='${note.id}'] .topBar .option`).forEach((option: Element) => {
                option.addEventListener("click", () => {
                    (function takeActionForTheNote(opt: string, index: number) {
                        let clickedCheckBtn: boolean = false;
                        let clickedPinBtn: boolean = false;
                        if (opt == "DELETE") { deleteNote(index); refreshNotes() };
                        if (opt == "PIN") { pinNote(index, clickedPinBtn); refreshNotes() };
                        if (opt == "CHECK") { checkNote(index, clickedCheckBtn); refreshNotes() };
                    })(option.id, Number(note.id))
                })
                $(option.parentElement?.parentElement).on("dblclick", () => {
                    editNote(Number(note.id))
                })
            })
            let notes: object[] = JSON.parse(localStorage.getItem("Notes"))
            function deleteNote(index: number) {
                if (confirm("==================== DELETE ==================== \nAre you sure? This action can not be reverted!")) {
                    notes.splice(index, 1)
                    localStorage.setItem("Notes", JSON.stringify(notes))
                }
            }
            function pinNote(index: number, clicked: boolean) {
                !clicked ? notes[index].Pinned = false : () => { notes[index].Pinned = true; clicked = true };
                localStorage.setItem("Notes", JSON.stringify(notes))
            }
            function checkNote(index: number, clicked: boolean) {
                !clicked ? notes[index].Checked = false : () => { notes[index].Checked = true; clicked = true };
                console.log("runned");
                
                localStorage.setItem("Notes", JSON.stringify(notes))
            }
            function editNote(index: number) {
                new NoteEditor("Edit", notes[index].TYPE, index);
            }
        })()
    });
}
renderNotes(JSON.parse(localStorage.getItem("Notes")));
export default function refreshNotes() {
    if ($`#NOTES_CONTAINER msg`.element) $(`#NOTES_CONTAINER msg`).remove()
    $`note`?.each((element: Element) => element.remove())
    renderNotes(JSON.parse(localStorage.getItem("Notes")))
}