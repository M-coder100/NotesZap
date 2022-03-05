import NoteEditor from "./noteEditor.js";
import $ from "./tquery.js";

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
        $(note).css.background = `linear-gradient(to bottom right, ${item.COLOR}c1, purple)`
        if (item.Checked) { note.classList.add("checked") }
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
        item.Pinned ? $`#NOTES_CONTAINER > #PINNED`.append(note) : $`#NOTES_CONTAINER`.append(note);
        // note options control
        (function noteControl() {
            document.querySelectorAll(`note[id='${note.id}'] .topBar .option`).forEach((option: Element) => {
                option.addEventListener("click", () => {
                    (function takeActionForTheNote(opt: string, index: number) {
                        if (opt == "DELETE") { deleteNote(index); refreshNotes() };
                        if (opt == "PIN") { pinNote(index); refreshNotes() };
                        if (opt == "CHECK") { checkNote(index); refreshNotes() };
                    })(option.id, Number(note.id))
                })
                option = option;
            })
            $(note).on("dblclick", () => {
                editNote(Number(note.id))
            })
            let notes: object[] = JSON.parse(localStorage.getItem("Notes"))
            function deleteNote(index: number) {
                if (confirm("==================== DELETE ==================== \nAre you sure? This action can not be reverted!")) {
                    notes.splice(index, 1)
                    localStorage.setItem("Notes", JSON.stringify(notes))
                }
            }
            function pinNote(index: number): void {
                notes[index].Pinned ? notes[index].Pinned = false : notes[index].Pinned = true;
                localStorage.setItem("Notes", JSON.stringify(notes))
            }
            function checkNote(index: number): void {
                notes[index].Checked ? notes[index].Checked = false : notes[index].Checked = true;
                localStorage.setItem("Notes", JSON.stringify(notes))
            }
            function editNote(index: number): void {
                let noteEditors: any[] = $`.noteEditor`.all();
                if (noteEditors.length < 2) {
                    if (!noteEditors[0]) {
                        new NoteEditor("Edit", notes[index].TYPE, index)
                        return;
                    }
                    noteEditors.forEach((element: HTMLElement) => {
                        Number(element.id) != index ? new NoteEditor("Edit", notes[index].TYPE, index) : element.remove();                       ; 
                    })
                }
                else alert("Maximum note editors reached.")
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