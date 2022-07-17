import { getfullDate, device } from "./app.js";
import {makeNewNoteToDatabase} from "./db.js";
import { refreshNotes } from "./notes.js";
import $ from "./tquery.js";
import { intro, mk, sort } from "./utils.js";
export default class NoteEditor {
    constructor(type: string, subType: string, index?: number) {
        const div: HTMLElement = $`div`.create(true);
        let headerValue: string;
        let noteValue: string;
        const fullDate: string = getfullDate();
        let elements: any;
        let sortValue: string = $`#SORT_BY`.value;
        const colorBar: string = `
        <div class="colorBar">
            <input class="color" id="#7fff00" style="background-color: #7fff00;" type="radio" name="option"/>
            <input class="color" id="#ffa72d" style="background-color: #ffa72d;" type="radio" name="option"/>
            <input class="color" id="#ff5d5d" style="background-color: #ff5d5d;" type="radio" name="option"/>
            <input class="color" id="#f72585" style="background-color: #f72585;" type="radio" name="option"/>
            <input class="color" id="#800080" style="background-color: #800080;" type="radio" name="option"/>
            <input class="color selected" id="#6410D0" style="background-color: #6410D0;" type="radio" name="option"/>
            <input class="color" id="#3a0ca3" style="background-color: #3a0ca3;" type="radio" name="option"/>
            <input class="color" id="#3f37c9" style="background-color: #3f37c9;" type="radio" name="option"/>
            <input class="color" id="#4262f0" style="background-color: #4262f0;" type="radio" name="option"/>
            <input class="color" id="#4CC9F0" style="background-color: #4CC9F0;" type="radio" name="option"/>
        </div>
        `;
        const topBar: string = `
        <div class="topBar">
            <div>
                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button"></div>
                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
            </div>
            <div id="NOTEEDITOR_TYPE">Create</div>
            <div id="NOTEEDITOR_TIME">${fullDate}</div>
        </div>
        `;

        function addNewLine() {
            let lastElement: HTMLElement = [...elements.textField.list_items()].at(-1);
            if (lastElement.children[1].innerHTML) {
                lastElement.insertAdjacentHTML("afterend", `<li class="note_item" id="checklist"><input class="checkBox" type="checkbox"/><label class="text" contenteditable></label></li>`)
                lastElement = [...elements.textField.list_items()].at(-1);
                (lastElement.children[1] as HTMLInputElement)?.focus();
                $(lastElement).on("keydown", (e: KeyboardEvent) => {
                    if (e.key == "Enter") {
                        e.preventDefault()
                        addNewLine();
                    }
                })
            }
        }
        const divider: string = `<div class="wrper"><div class="divider"></div></div>`;
        switch (type) {
            case "Create":
                switch (subType) {
                    case "mk":
                        $(div).HTML(`
                        ${topBar}
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note" data-intro="Type your note header here">
                            ${divider}
                            <div class="noteText" contenteditable="true" data-placeholder="I want to do..."></div>
                        </div>
                        <nav class="navBar">
                            ${colorBar}
                            <div class="btnGrp">
                            <ion-icon name="logo-markdown" class="preview editorNavBtn" type="button" tabindex="0" title="Preview"></ion-icon>
                            <ion-icon name="arrow-forward-outline" class="saveButton editorNavBtn" type="button" tabindex="0" title="Save"></ion-icon>
                            </div>
                        </nav>
                        <div class="previewPanel">
                            <nav class="topbar">Markdown preview</nav>
                            <div class="preview"></div>
                        </div>
                        `);

                        $`.noteEditor`.each((item: HTMLElement) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device() == "mobile" ? "full" : "compact", "active");
                        elements = {
                            navBar: {
                                this: div.children[2],
                                colorBar: {
                                    this: div.children[2].children[0],
                                    colors: div.children[2].children[0].children
                                },
                                toMarkdownBtn: div.children[2].children[1].children[0],
                                saveButton: div.children[2].children[1].children[1],
                            },
                            previewPanel: {
                                this: div.children[3],
                                topBar: div.children[3].children[0],
                                preview: div.children[3].children[1]
                            },
                            topBar: div.children[0],
                            textField: {
                                noteHeader: () => div.children[1].children[0],
                                noteValue: () => div.children[1].children[2]
                            },
                        }

                        this.editorIntro(elements, div)

                        $(elements.textField.noteHeader()).element.focus();
                        var colors = $`.noteEditor.active .colorBar > .color`.all();
                        var color: string = "#6410D0";
                        colors.forEach((colorItem: HTMLElement) => {
                            colorItem.onclick = () => {
                                colors.forEach((elem: HTMLElement) => elem.classList.remove("selected"))
                                colorItem.classList.add("selected")
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            }
                        })
                        
                        $(elements.textField.noteValue()).on("input", () => {
                            elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText)
                        })
                        
                        $(elements.navBar.toMarkdownBtn).On(["click", "keyup"], (event: any) => {
                            event.target.classList.toggle("active")
                            div.classList.toggle("side")
                            event.target.classList.contains("active") ? $(elements.previewPanel.this).css.display = "block" : $(elements.previewPanel.this).css.display = "none";
                            elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText)
                        })
                        {
                            $(elements.navBar.saveButton).On(["click", "keyup"], () => saveNote())
                            $(div).on("keydown", (event: KeyboardEvent) => {
                                if (subType == "mk") {
                                    if (event.key == "s" && event.ctrlKey) {
                                        event.preventDefault();
                                        saveNote()
                                    }
                                }
                            })
                            
                            function saveNote() {
                                let activeNoteEditor: HTMLElement = div;
                                headerValue = $(activeNoteEditor.children[1].children[0]).value;
                                noteValue = $(activeNoteEditor.children[1].children[2]).element.innerHTML;
                                $(activeNoteEditor.children[1].children[2]).element.innerHTML = noteValue.replace(/<b>(.*?)<\/b>/g, "**$1**");
                                $(activeNoteEditor.children[1].children[2]).element.innerHTML = $(activeNoteEditor.children[1].children[2]).element.innerHTML.replace(/<i>(.*?)<\/i>/g, "_$1_");
                                noteValue = $(activeNoteEditor.children[1].children[2]).text;
                                
                                if (headerValue.trim() || noteValue.trim()) {
                                    activeNoteEditor.style.transition = "left 1s ease";
                                    device() == "desktop" ? activeNoteEditor.style.left = `${window.outerWidth}px` : activeNoteEditor.remove();
                                    elements.previewPanel.this.remove()
                                    makeNewNoteToDatabase({
                                        TITLE: headerValue,
                                        NOTE: noteValue,
                                        Pinned: false,
                                        Checked: false,
                                        TIME: fullDate,
                                        COLOR: color,
                                        TYPE: subType
                                    })
                                    refreshNotes();
                                    $`note`.all()[0].classList.add("edited");
                                    sortValue == "ol" ? window.scrollTo(0, $("#NOTES_CONTAINER").element.scrollHeight) : null;
                                    setTimeout(() => activeNoteEditor.remove(), 1000);
                                }
                            }
                        }
                        break;

                    case "ls":
                        $(div).HTML(`
                        ${topBar}
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note">
                            ${divider}
                            <div class="noteText"><li class="note_item" id="checklist"><input class="checkBox" type="checkbox"/><label class="text" contenteditable></label></li></div>
                        </div>
                        <nav class="navBar">
                            ${colorBar}
                            <div class="btnGrp">
                                <ion-icon name="add-outline" class="addNewLineBtn editorNavBtn" type="button" tabindex="0" title="Add new line"></ion-icon>
                                <ion-icon name="arrow-forward-outline" class="saveButton editorNavBtn" type="button" tabindex="0" title="Save"></ion-icon>
                            </div>
                        </nav>

                        `);
                        $`.noteEditor`.each((item: HTMLElement) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device() == "mobile" ? "full" : "compact", "active");
                        elements = {
                            navBar: {
                                this: div.children[2],
                                colorBar: {
                                    this: div.children[2].children[0],
                                    colors: div.children[2].children[0].children
                                },
                                addNewLineBtn: div.children[2].children[1].children[0],
                                saveButton: div.children[2].children[1].children[1],
                            },
                            topBar: div.children[0],
                            textField: {
                                noteHeader: () => div.children[1].children[0],
                                list_items: () => div.children[1].children[2].children
                            },
                        }
                        $(elements.textField.noteHeader()).element.focus();
                        $(elements.textField.noteHeader()).on("keyup", ({key}: KeyboardEvent) => { if (key == "Enter") elements.textField.list_items()[0].children[1].focus()})
                        var colors = $`.noteEditor.active .colorBar > .color`.all();
                        var color: string = "#6410D0";
                        colors.forEach((colorItem: HTMLElement) => {
                            colorItem.onclick = () => {
                                colors.forEach((elem: HTMLElement) => elem.classList.remove("selected"))
                                colorItem.classList.add("selected")
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            }
                        })
                        let lastElement = elements.textField.list_items()[elements.textField.list_items().length - 1];
                        $(lastElement.children[1]).on("keydown", (e: KeyboardEvent) => {
                            if (e.key == "Enter") {
                                e.preventDefault()
                                addNewLine();
                            }
                        });
                        $(elements.navBar.addNewLineBtn).On(["click", "keyup"], () => addNewLine());
                        {
                            $(elements.navBar.saveButton).On(["click", "keyup"], () => saveNote())
                            $(div).on("keydown", (event: KeyboardEvent) => {
                                if (subType == "ls") {
                                    if (event.key == "s" && event.ctrlKey) {
                                        event.preventDefault();
                                        saveNote()
                                    }
                                }
                            })
                            function saveNote() {
                                if (lastElement.children[1].innerHTML || [...elements.textField.list_items()].length > 1) {
                                    let values: string[] = [];
                                    [...elements.textField.list_items()].forEach((item: any) => {
                                        var currentValue = item.children[1].innerHTML;
                                        if (currentValue) {
                                            let isChecked = item.children[0]?.checked;
                                            values.push(isChecked ? "✔️"+currentValue : currentValue);
                                        };
                                    })
                                    // 
                                    div.style.transition = "left 1s ease";
                                    device() == "desktop" ? div.style.left = `${window.outerWidth}px` : div.remove();
                                    makeNewNoteToDatabase({
                                        TITLE: elements.textField.noteHeader().value,
                                        NOTE: values.join("\n"),
                                        Pinned: false,
                                        Checked: false,
                                        TIME: fullDate,
                                        COLOR: color,
                                        TYPE: subType
                                    })
                                    refreshNotes();
                                    $`note`.all()[index||0].classList.add("edited");
                                    setTimeout(() => div.remove(), 1000);
                                }
                            }
                        }
                        break;
                }
                break;
            case "Edit":
                if (!index && index != 0) return;
                const notes: object[] = sort(sortValue, JSON.parse(localStorage.getItem("Notes") || "{}"))
                const currentNote: any = notes[index];
                switch (subType) {
                    case "mk":
                        currentNote.NOTE = currentNote.NOTE.replace(/\n/g, "<br/>");
                        div.id = JSON.stringify(index);
                        $(div).HTML(`
                        ${topBar}
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note" value="${currentNote.TITLE}">
                            ${divider}
                            <div class="noteText" contenteditable="true" data-placeholder="I want to do...">${currentNote.NOTE}</div>
                        </div>
                        <nav class="navBar">
                            ${colorBar}
                            <div class="btnGrp">
                                <ion-icon name="logo-markdown" class="preview editorNavBtn" type="button" tabindex="0" title="Preview"></ion-icon>
                                <ion-icon name="arrow-forward-outline" class="saveButton editorNavBtn" type="button" tabindex="0" title="Save"></ion-icon>
                            </div>
                        </nav>
                        <div class="previewPanel">
                            <nav class="topbar">Markdown preview</nav>
                            <div class="preview"></div>
                        </div>

                        `);
                        elements = {
                            navBar: {
                                this: div.children[2],
                                colorBar: {
                                    this: div.children[2].children[0],
                                    colors: div.children[2].children[0].children
                                },
                                toMarkdownBtn: div.children[2].children[1].children[0],
                                saveButton: div.children[2].children[1].children[1],
                            },
                            previewPanel: {
                                this: div.children[3],
                                topBar: div.children[3].children[0],
                                preview: div.children[3].children[1]
                            },
                            topBar: div.children[0],
                            textField: {
                                noteHeader: () => div.children[1].children[0],
                                noteValue: () => div.children[1].children[2]
                            },
                        }
                        $`.noteEditor`.each((item: HTMLElement) => item.classList.remove("active"))
                        $(div).addClass("noteEditor", device() == "mobile" ? "full" : "compact", "active");
                        $(elements.textField.noteHeader()).element.focus();


                        var colors: any[] = [...elements.navBar.colorBar.colors];
                        var color: string = currentNote.COLOR;
                        $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                        $(elements.topBar).css.background = `${color}`;


                        colors.forEach((colorItem: Element) => {
                            if (colorItem.id == color) {
                                colors.forEach((elem: Element) => elem.classList.remove("selected"))
                                colorItem.classList.add("selected")
                            }
                            colorItem.addEventListener("click", () => {
                                colors.forEach((elem: Element) => elem.classList.remove("selected"))
                                colorItem.classList.add("selected")
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(elements.topBar).css.background = `${color}`;
                            })
                        })

                        $(elements.textField.noteValue()).on("input", () => elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText))

                        $(elements.navBar.toMarkdownBtn).On(["click", "keyup"], (event: any) => {
                            event.target.classList.toggle("active")
                            div.classList.toggle("side")
                            event.target.classList.contains("active") ? $(elements.previewPanel.this).css.display = "block" : $(elements.previewPanel.this).css.display = "none";
                            elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText)
                        })

                        {
                            $(elements.navBar.saveButton).On(["click", "keyup"], () => saveNote())
                            $(div).on("keydown", (event: KeyboardEvent) => {
                                if (subType == "mk") {
                                    if (event.key == "s" && event.ctrlKey) {
                                        event.preventDefault();
                                        saveNote()
                                    }
                                }
                            })

                            function saveNote() {
                                let activeNoteEditor: HTMLElement = div;
                                headerValue = $(activeNoteEditor.children[1].children[0]).value;
                                noteValue = $(activeNoteEditor.children[1].children[2]).element.innerHTML;
                                $(activeNoteEditor.children[1].children[2]).element.innerHTML = noteValue.replace(/<b>(.*?)<\/b>/g, "**$1**");
                                $(activeNoteEditor.children[1].children[2]).element.innerHTML = $(activeNoteEditor.children[1].children[2]).element.innerHTML.replace(/<i>(.*?)<\/i>/g, "_$1_");
                                noteValue = $(activeNoteEditor.children[1].children[2]).text;

                                if (headerValue.trim() || noteValue.trim()) {
                                    activeNoteEditor.style.transition = "left 1s ease";
                                    device() == "desktop" ? activeNoteEditor.style.left = `${window.outerWidth}px` : activeNoteEditor.remove();
                                    elements.previewPanel.this.remove()
                                    notes[index||0] = {
                                        TITLE: headerValue,
                                        NOTE: noteValue,
                                        Pinned: currentNote.Pinned,
                                        Checked: currentNote.Checked,
                                        TIME: fullDate,
                                        COLOR: color,
                                        TYPE: subType
                                    }
                                    localStorage.setItem("Notes", JSON.stringify(notes));
                                    refreshNotes();
                                    $`note`.all()[index||0].classList.add("edited");
                                    setTimeout(() => activeNoteEditor.remove(), 1000);
                                }
                            }
                        }
                        break;
                    case "ls":
                        $(div).HTML(`
                        ${topBar}
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note" value="${currentNote.TITLE}" data-intro="Type your note header here">
                            ${divider}
                            <div class="noteText" data-intro="Type what are you going to do today"></div>
                        </div>
                        <nav class="navBar">
                            ${colorBar}
                            <div class="btnGrp">
                                <ion-icon name="add-outline" class="addNewLineBtn editorNavBtn" type="button" tabindex="0" title="Add new line"></ion-icon>
                                <ion-icon name="arrow-forward-outline" class="saveButton editorNavBtn" type="button" tabindex="0" title="Save" data-intro="Click to save your note"></ion-icon>
                            </div>
                        </nav>
                        `);
                        currentNote.NOTE.split("\n").forEach((str: string) => {
                            let isChecked: boolean = !!str.split("✔️")[1]
                            div.children[1].children[2].innerHTML += `<li class="note_item ${isChecked ? "done":""}" id="checklist"><input class="checkBox" type="checkbox" ${isChecked && "checked"}/><label class="text" contenteditable>${str.split("✔️")[1] || str}</label></li>`
                        });
                        $`.noteEditor`.each((item: HTMLElement) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device() == "mobile" ? "full" : "compact", "active");
                        elements = {
                            navBar: {
                                this: div.children[2],
                                colorBar: {
                                    this: div.children[2].children[0],
                                    colors: div.children[2].children[0].children
                                },
                                addNewLineBtn: div.children[2].children[1].children[0],
                                saveButton: div.children[2].children[1].children[1],
                            },
                            topBar: div.children[0],
                            textField: {
                                noteHeader: () => div.children[1].children[0],
                                list_items: () => div.children[1].children[2].children
                            },
                        }
                        $(elements.textField.noteHeader()).element.focus();
                        $(elements.textField.noteHeader()).on("keyup", ({key}: KeyboardEvent) => { if (key == "Enter") elements.textField.list_items()[0].children[1].focus()})

                        var colors = $`.noteEditor.active .colorBar > .color`.all();
                        var color: string = currentNote.COLOR;
                        $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                        $(elements.topBar).css.background = `${color}`;
                        [...elements.textField.list_items()].forEach((elem: HTMLElement) => {
                            $(elem.children[0]).On(["click", "keyup"], () => {
                                elem.classList.toggle("done");
                            })
                        })
                        colors.forEach((colorItem: HTMLElement) => {
                            if (colorItem.id == color) {
                                colors.forEach((elem: Element) => elem.classList.remove("selected"))
                                colorItem.classList.add("selected")
                            }
                            colorItem.onclick = () => {
                                colors.forEach((elem: HTMLElement) => elem.classList.remove("selected"))
                                colorItem.classList.add("selected")
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            }
                        })
                        
                        let lastElement = elements.textField.list_items()[elements.textField.list_items().length - 1];
                        $(lastElement.children[1]).on("keydown", (e: KeyboardEvent) => {
                            if (e.key == "Enter") {
                                e.preventDefault()
                                addNewLine();
                            }
                        })
                        $(elements.navBar.addNewLineBtn).On(["click", "keyup"], () => addNewLine())
                        
                        {
                            $(elements.navBar.saveButton).On(["click", "keyup"], () => saveNote())
                            $(div).on("keydown", (event: KeyboardEvent) => {
                                if (subType == "ls") {
                                    if (event.key == "s" && event.ctrlKey) {
                                        event.preventDefault();
                                        saveNote()
                                    }
                                }
                            })
                            function saveNote() {
                                if (lastElement.children[1].innerHTML || [...elements.textField.list_items()].length > 1) {
                                    let values: string[] = [];
                                    [...elements.textField.list_items()].forEach((item: any) => {
                                        var currentValue = item.children[1].innerHTML;
                                        if (currentValue) {
                                            let isChecked = item.children[0]?.checked;
                                            values.push(isChecked ? "✔️"+currentValue : currentValue);
                                        };
                                    })
                                    div.style.transition = "left 1s ease";
                                    device() == "desktop" ? div.style.left = `${window.outerWidth}px` : div.remove();
                                    notes[index||0] = {
                                        TITLE: elements.textField.noteHeader().value,
                                        NOTE: values.join("\n"),
                                        Pinned: currentNote.Pinned,
                                        Checked: currentNote.Checked,
                                        TIME: fullDate,
                                        COLOR: color,
                                        TYPE: subType
                                    }
                                    localStorage.setItem("Notes", JSON.stringify(notes));
                                    refreshNotes();
                                    $`note`.all()[index||0].classList.add("edited");
                                    setTimeout(() => div.remove(), 1000);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:
                console.warn("Error in type!");
                break;
        }

        if (!!div.classList[0]) {
            (function editorMovement() {
                const topBar = div.children[0];
                let currentDiv: any;
                let isDown: boolean;
                $(topBar).on('mousedown', function (e: MouseEvent) {
                    isDown = true;
                    const offset = [
                        div.offsetLeft - e.clientX,
                        div.offsetTop - e.clientY
                    ];
                    div.classList.contains("active") || div.classList.add("active"); 
                    div.setAttribute('data-offset', JSON.stringify(offset));
                    currentDiv = div;
                });
                $(topBar).on('touchstart', function (event: TouchEvent) {
                    isDown = true;
                    const offset = [
                        div.offsetLeft - event.touches[0].clientX,
                        div.offsetTop - event.touches[0].clientY,
                    ];
                    div.setAttribute('data-offset', JSON.stringify(offset));
                    currentDiv = div;
                });
                document.addEventListener('mouseup', () => isDown = false, true);
                document.addEventListener('touchend', () => isDown = false, true);

                document.addEventListener('mousemove', (event: MouseEvent) => {
                    event.preventDefault();
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.clientX,
                            y: event.clientY,
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = ((mousePosition.x + offset[0]) + 'px');
                        currentDiv.style.top = ((mousePosition.y + offset[1]) + 'px');
                    }
                }, true);
                document.addEventListener('touchmove', (event: TouchEvent) => {
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.touches[0].clientX,
                            y: event.touches[0].clientY,
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = (mousePosition.x + offset[0]) + 'px';
                        currentDiv.style.top = (mousePosition.y + offset[1]) + 'px';
                    }
                }, { passive: true });
            })()

            $("#NOTEEDITOR_CLOSE").each((element: Element) => { $(element).on("click", () => element.parentElement?.parentElement?.parentElement?.remove()) })
            if (device() == "desktop") {
                $("#NOTEEDITOR_MINIMIZE").each((element: Element) => {
                    $(element).on("click", () => {
                        div.style.top = "0px";
                        element.parentElement?.parentElement?.parentElement?.classList.add("compact");
                        element.parentElement?.parentElement?.parentElement?.classList.remove("full")
                    })
                })
                $("#NOTEEDITOR_MAXIMIZE").each((element: Element) => {
                    $(element).on("click", () => {
                        element.parentElement?.parentElement?.parentElement?.classList.add("full");
                        element.parentElement?.parentElement?.parentElement?.classList.remove("compact");
                    })
                })
            }
        }
    }
    editorIntro(elements?: any, div?: HTMLElement) {
        intro().setOptions({
            disableInteraction: true,
            dontShowAgain: true,
            steps: [{
                title: 'Note editor',
                element: div,
                intro: 'This is a note editor, where you can edit, write or view notes'
            },
            {
                element: elements.textField.noteHeader(),
                intro: 'Here you can write a brief discription or header of your note'
            },
            {
                element: elements.textField?.noteValue(),
                intro: 'And in this you can write the main things you want to do'
            },
            {
                title: 'Editor nav',
                element: elements.navBar.this,
                intro: 'Here you can change the color, preview, save and add enchancements to your note'
            },
            {
                title: 'Save',
                element: elements.navBar.saveButton,
                intro: 'After you are are completed with writing the note you can click here to save the note'
            }]
        }).start();
    }
}