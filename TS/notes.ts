import NoteEditor from "./noteEditor.js";
import popup from "./popup.js";
import $ from "./tquery.js";
import * as utils from "./utils.js";
type dbNoteType = {
    TITLE: string,
    NOTE: string,
    Pinned: boolean,
    Checked: boolean,
    TIME: string,
    COLOR: string,
    TYPE: string
}
export function renderNotes(notes: dbNoteType[]) {
    if (!notes || !notes[0]) {
        const msg = document.createElement("msg");
        $(msg).HTML(`<h1 id="NOTE_HEADER">No Notes Found</h1>Create your first note by clicking the add button or pressing the "+" key from your keyboard or you can import data
        <a style="font-size: 1.2em;" id="ImportDataBtn">
        <ion-icon name="download-outline"></ion-icon>
         Import Data</a>`)
        $`#NOTES_CONTAINER`.append(msg);
        // $`#ImportDataBtn`.on("click", () => {
        //     new popup(`
        //         <fieldset>
        //             <legend>Import Data</legend>
        //             <p>Paste the Notes Zap data over here to import</p>
        //             <input placeholder="Notes Zap Data" type="search"/>
        //             <nav class="bottomBar">
        //                 <button class="outline">Cancel</button>
        //                 <button>Done</button>                        
        //             </nav>
        //         </fieldset>
        //     `, "dialog")
        // })
        return;
    }
    // Main loop
    try {
        notes.forEach((item: dbNoteType) => {
            const note = document.createElement("note");
            note.tabIndex = 0;
            if (item.TYPE == "msg") {
                note.innerHTML = `
                    <h1>${item.TITLE}</h1>
                    <p>Try searching by a better keyword or other.</p>
                `;
                $(note).css.textAlign = "center"
                $(note).css.fontWeight = "800"
                $(note).css.padding = "20px"
                $`#NOTES_CONTAINER`.append(note);
                return;
            }
            let id: string = "";
            notes.forEach((elem: any) => elem.NOTE ? elem.NOTE == item.NOTE ? id = JSON.stringify(notes.indexOf(elem)) : false : elem.TITLE == item.TITLE ? id = JSON.stringify(notes.indexOf(elem)) : false)
            note.id = id;
            
            // default
            let typeToText: string = "";
            const topBarMarkup = (): string => `
            <div class="topBar">
                <div class="grp">
                    <div class="option" id="CHECK" title="Mark done"></div>
                    <div class="option" id="PIN" title="Pin to top"></div>
                    <div class="option" id="DELETE" title="Move to trash"></div>
                </div>
                <span id="TIME">Modified: ${item.TIME} ( ${typeToText} )</span>
            </div>
            `;
            $(note).css.background = `${item.COLOR}8a`;
            if (item.Checked) { note.classList.add("checked") };
            switch (item.TYPE) {
                case "mk":
                    typeToText = "Markdown";
                    if (item.NOTE) item.NOTE = utils.mk(item.NOTE);
                    $(note).HTML(`
                        ${topBarMarkup()}
                        ${item.TITLE ? `
                        <h1 id="NOTE_HEADER" style="font-size: ${item.NOTE ? "40px" : "60px"};">${item.TITLE}</h1>
                        ${item.NOTE ? `
                        <div class="wrper">
                            <div class="divider"></div>
                        </div>
                        <div id="NOTE_TEXT">${item.NOTE}</div>
                        ` : ""}` : `<div id="NOTE_TEXT" style="font-size: 25px; height: 100%;">${item.NOTE}</div>`}
                    `);
                    break;
                case "ls":
                    typeToText = "List";
                    $(note).HTML(`
                        ${topBarMarkup()}
                        ${item.TITLE ? `
                            <h1 id="NOTE_HEADER">${item.TITLE}</h1>
                            <div class="wrper"><div class="divider"></div></div>
                        ` : ""}
                        <div class="items" id="NOTE_TEXT"></div>
                    `)
                    item.NOTE.split("\n").forEach((elem: string) => note.children[note.children.length-1].innerHTML += `<div class='item ${item.NOTE.split("\n").indexOf(elem)}' id="checklist"><input type="checkbox" ${elem.split("✔️")[1] && "checked"}/><label class="text">${elem.split("✔️")[1] || elem}</label></div>`)
                    let noteItems = [...note.children[note.children.length-1].children];
                    let values: string[] = item.NOTE.split("\n");
                    noteItems.forEach((noteItem: Element) => {
                        $(noteItem.children[0]).On(["click", "keyup"], () => {
                            if(!noteItem.children[1]) return;
                            let index = noteItem.classList[1];
                            let notes: dbNoteType[] = JSON.parse(localStorage.getItem("Notes") || "{}");                        
                            let checkbox: any = noteItem.children[0];
                            console.log(values[Number(index[0])]);
                            
                            if (checkbox.checked) {
                                // if the checkbox is checked then add the check sign in front of the text
                                values[Number(index[0])] = "✔️"+values[Number(index[0])];
                            } else {
                                // if not checked then remove the check sign if present
                                values[Number(index[0])] = values[Number(index[0])].split("✔️")[1];
                            }
                            console.log(values);
                            
                            notes[Number(note.id)] = {
                                TITLE: item.TITLE,
                                NOTE: values.join("\n"),
                                Pinned: item.Pinned,
                                Checked: item.Checked,
                                TIME: item.TIME,
                                COLOR: item.COLOR,
                                TYPE: item.TYPE
                            }
                            localStorage.setItem("Notes", JSON.stringify(notes));
                        })
                    })
                    break;
    
                default:
                    break;
            }
            item.Pinned ? $`#NOTES_CONTAINER > #PINNED`.append(note) : $`#NOTES_CONTAINER`.append(note);
    
            // note options control 
            (function noteControl() {
                $(note).on("keyup", ({key}: KeyboardEvent) => {
                    switch(key) {
                        case "e" || " ":
                            editNote(Number(note.id));
                            break;
                        case "d":
                            deleteNote(Number(note.id));
                            break;
                        case "c":
                            checkNote(Number(note.id));
                            break;
                        case "p":
                            pinNote(Number(note.id));
                            break;
                        default: return;
                    }
                    refreshNotes();
                    document.getElementById(note.id)?.focus();
                })
                document.getElementById(note.id)?.querySelectorAll(`.topBar .option`).forEach((option: Element) => {
                    option.addEventListener("click", () => {
                        (function takeActionForTheNote(opt: string, index: number) {
                            if (opt == "DELETE") { deleteNote(index); refreshNotes() };
                            if (opt == "PIN") { pinNote(index); refreshNotes() };
                            if (opt == "CHECK") { checkNote(index); refreshNotes() };
                        })(option.id, Number(note.id))
                    })
                    option = option;
                })
                let touchtime: number = 0;
                $(note).on("click", (e:MouseEvent) => {
                    if (e.ctrlKey) {
                        editNote(Number(note.id))
                        touchtime = 0;
                        return;
                    }
                    if (touchtime == 0)
                        touchtime = new Date().getTime();
                    else {
                        // compare first click to this click and see if they occurred within double click threshold
                        if (((new Date().getTime()) - touchtime) < 800) {
                            // double click occurred
                            editNote(Number(note.id))
                        } else touchtime = new Date().getTime();
                    }
                })
                let notes: Array<any> = JSON.parse(localStorage.getItem("Notes") || "{}");
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
                            Number(element.id) != index ? new NoteEditor("Edit", notes[index].TYPE, index) : element.remove();
                        })
                    }
                    else alert("Maximum note editors reached.")
                }
            })()
        });
    } catch (error) {
        console.log(`%c⚠️ ERR (notes.ts): ${error}`, "background: red; padding: 10px 5px;");
        
    }
}
renderNotes(JSON.parse(localStorage.getItem("Notes") || "{}"));
export function refreshNotes() {
    if ($`#NOTES_CONTAINER msg`.element) $(`#NOTES_CONTAINER msg`).remove()
    $`note`?.each((element: Element) => element.remove())
    renderNotes(JSON.parse(localStorage.getItem("Notes") || "{}"))
}