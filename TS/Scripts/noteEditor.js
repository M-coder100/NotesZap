import { getfullDate, device } from "./app.js";
import makeNewNoteToDatabase from "./db.js";
import { refreshNotes } from "./notes.js";
import $ from "./tquery.js";
import { mk } from "./utils.js";
export default class NoteEditor {
    constructor(type, subType, index) {
        const div = $ `div`.create();
        let headerValue;
        let noteValue;
        let fullDate = getfullDate();
        let elements;
        switch (type) {
            case "Create":
                switch (subType) {
                    case "mk":
                        $(div).HTML(`
                        
                        <div class="topBar">
                            <div style="display: flex; gap: 5px;">
                                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button"></div>
                                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
                            </div>
                            <div id="NOTEEDITOR_TYPE">Create</div>
                            <div id="NOTEEDITOR_TIME">${fullDate}</div>
                        </div>
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note">
                            <div class="wrper">
                            <div class="divider"></div>
                            </div>
                            <div class="noteText" contenteditable="true" data-placeholder="I want to do..."></div>
                            </div>
                        <nav class="navBar">
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
                        $(document.body).append(div);
                        $ `.noteEditor`.each((item) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device == "mobile" ? "full" : "compact", "active");
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
                        };
                        $(elements.textField.noteHeader()).element.focus();
                        var colors = $ `.noteEditor.active .colorBar > .color`.all();
                        var color = "#6410D0";
                        colors.forEach((colorItem) => {
                            colorItem.onclick = () => {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            };
                        });
                        $(elements.textField.noteValue()).on("input", () => {
                            elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText);
                        });
                        $(elements.navBar.toMarkdownBtn).On(["click", "keyup"], (event) => {
                            event.target.classList.toggle("active");
                            div.classList.toggle("side");
                            event.target.classList.contains("active") ? $(elements.previewPanel.this).css.display = "block" : $(elements.previewPanel.this).css.display = "none";
                            elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText);
                        }, true);
                        $(elements.navBar.saveButton).On(["click", "keyup"], () => {
                            headerValue = $(div.children[1].children[0]).value;
                            noteValue = $(div.children[1].children[2]).element.innerHTML;
                            let activeNoteEditor = $ `.noteEditor.active`.element;
                            if (headerValue.trim() || noteValue.trim()) {
                                $(activeNoteEditor.children[1].children[2]).element.innerHTML = noteValue.replace(/<b>(.*?)<\/b>/g, "**$1**");
                                $(activeNoteEditor.children[1].children[2]).element.innerHTML = $(activeNoteEditor.children[1].children[2]).element.innerHTML.replace(/<i>(.*?)<\/i>/g, "_$1_");
                                noteValue = $(activeNoteEditor.children[1].children[2]).text;
                                activeNoteEditor.style.transition = "left 1s ease";
                                device == "desktop" ? activeNoteEditor.style.left = `${window.innerWidth}px` : activeNoteEditor.remove();
                                makeNewNoteToDatabase({
                                    TITLE: headerValue,
                                    NOTE: noteValue,
                                    Pinned: false,
                                    Checked: false,
                                    TIME: fullDate,
                                    COLOR: color,
                                    TYPE: subType
                                });
                                refreshNotes();
                                $ `#NOTES_CONTAINER > note:first-of-type`.addClass("new");
                                setTimeout(() => activeNoteEditor.remove(), 1000);
                            }
                        }, true);
                        break;
                    case "ls":
                        $(div).HTML(`

                        <div class="topBar">
                            <div style="display: flex; gap: 5px;">
                                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button"></div>
                                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
                            </div>
                            <div id="NOTEEDITOR_TYPE">Create</div>
                            <div id="NOTEEDITOR_TIME">${fullDate}</div>
                        </div>
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note">
                            <div class="wrper"><div class="divider"></div></div>
                            <div class="noteText"><li class="note_item" id="checklist"><input class="checkBox" type="checkbox"/><label class="text" contenteditable></label></li></div>
                        </div>
                        <nav class="navBar">
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
                            <div class="btnGrp">
                                <ion-icon name="add-outline" class="addNewLineBtn editorNavBtn" type="button" tabindex="0" title="Add new line"></ion-icon>
                                <ion-icon name="arrow-forward-outline" class="saveButton editorNavBtn" type="button" tabindex="0" title="Save"></ion-icon>
                            </div>
                        </nav>

                        `);
                        $(document.body).append(div);
                        $ `.noteEditor`.each((item) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device == "mobile" ? "full" : "compact", "active");
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
                        };
                        $(elements.textField.noteHeader()).element.focus();
                        var colors = $ `.noteEditor.active .colorBar > .color`.all();
                        var color = "#6410D0";
                        colors.forEach((colorItem) => {
                            colorItem.onclick = () => {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            };
                        });
                        let lastElement = elements.textField.list_items()[elements.textField.list_items().length - 1];
                        $(lastElement.children[1]).on("keydown", (e) => {
                            if (e.key == "Enter") {
                                e.preventDefault();
                                addNewLine();
                            }
                        });
                        $(elements.navBar.addNewLineBtn).On(["click", "keyup"], () => addNewLine());
                        $(elements.navBar.saveButton).On(["click", "keyup"], () => {
                            if (lastElement.children[1].innerHTML) {
                                let values = [];
                                [...elements.textField.list_items()].forEach((item) => {
                                    var currentValue = item.children[1].innerHTML;
                                    let isChecked = item.children[0]?.checked;
                                    values.push(isChecked ? "✔️" + currentValue : currentValue);
                                });
                                div.style.transition = "left 1s ease";
                                device == "desktop" ? div.style.left = `${window.innerWidth}px` : div.remove();
                                makeNewNoteToDatabase({
                                    TITLE: elements.textField.noteHeader().value,
                                    NOTE: values.join("\n"),
                                    Pinned: false,
                                    Checked: false,
                                    TIME: fullDate,
                                    COLOR: color,
                                    TYPE: subType
                                });
                                refreshNotes();
                                $ `#NOTES_CONTAINER > note:first-of-type`.addClass("new");
                                setTimeout(() => div.remove(), 1000);
                            }
                        });
                        function addNewLine() {
                            if (lastElement.children[1].innerHTML) {
                                lastElement.insertAdjacentHTML("afterend", `<li class="note_item" id="checklist"><input class="checkBox" type="checkbox"/><label class="text" contenteditable></label></li>`);
                                lastElement = elements.textField.list_items()[elements.textField.list_items().length - 1];
                                lastElement.children[1].focus();
                                $(lastElement).on("keydown", (e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault();
                                        addNewLine();
                                    }
                                });
                            }
                        }
                        break;
                    case "kb":
                        // makeNewNoteToDatabase({
                        //     TITLE: "",
                        //     items: [],
                        //     TIME: fullDate,
                        //     Checked: false,
                        //     Pinned: false,
                        //     TYPE: subType,
                        //     COLOR: "#560bad"
                        // })
                        // refreshNotes();
                        // $`#NOTES_CONTAINER > note:first-of-type`.addClass("new")
                        break;
                    case "sp":
                        $(div).HTML(`

                        <div class="topBar">
                            <div style="display: flex; gap: 5px;">
                                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button" disabled></div>
                                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
                            </div>
                            <div id="NOTEEDITOR_TYPE">Create</div>
                            <div id="NOTEEDITOR_TIME">${fullDate}</div>
                        </div>
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note">
                            <div class="wrper">
                                <div class="divider"></div>
                            </div>
                            <div class="noteText">
                                <div class="text">I want to do...</div>
                            </div>
                        </div>

                        `);
                        $(document.body).append(div);
                        $(div).addClass("noteEditor", "compact");
                        break;
                    case "dy":
                        $(div).HTML(`

                        <div class="topBar">
                            <div style="display: flex; gap: 5px;">
                                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button" disabled></div>
                                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
                            </div>
                            <div id="NOTEEDITOR_TYPE">Create</div>
                            <div id="NOTEEDITOR_TIME">${fullDate}</div>
                        </div>
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note">
                            <div class="wrper">
                                <div class="divider"></div>
                            </div>
                            <div class="noteText">
                                <div class="text">I want to do...</div>
                            </div>
                        </div>

                        `);
                        $(document.body).append(div);
                        $(div).addClass("noteEditor", "compact");
                        break;
                }
                break;
            case "Edit":
                if (!index && index != 0)
                    return;
                const notes = JSON.parse(localStorage.getItem("Notes") || "{}");
                const currentNote = notes[index];
                switch (subType) {
                    case "mk":
                        currentNote.NOTE = currentNote.NOTE.replace(/\n/g, "<br/>");
                        div.id = JSON.stringify(index);
                        $(div).HTML(`
                        <div class="topBar">
                            <div style="display: flex; gap: 5px;">
                                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button"></div>
                                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
                            </div>
                            <div id="NOTEEDITOR_TYPE">Edit</div>
                            <div id="NOTEEDITOR_TIME">${currentNote.TIME}</div>
                        </div>
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note" value="${currentNote.TITLE}">
                            <div class="wrper">
                                <div class="divider"></div>
                            </div>
                            <div class="noteText" contenteditable="true" data-placeholder="I want to do...">${currentNote.NOTE}</div>
                        </div>
                        <nav class="navBar">
                            <div class="colorBar">
                                <input class="color" id="#7fff00" style="background-color: #7fff00;" type="radio" name="option"/>
                                <input class="color" id="#ffa72d" style="background-color: #ffa72d;" type="radio" name="option"/>
                                <input class="color" id="#ff5d5d" style="background-color: #ff5d5d;" type="radio" name="option"/>
                                <input class="color" id="#f72585" style="background-color: #f72585;" type="radio" name="option"/>
                                <input class="color" id="#800080" style="background-color: #800080;" type="radio" name="option"/>
                                <input class="color" id="#6410D0" style="background-color: #6410D0;" type="radio" name="option"/>
                                <input class="color" id="#3a0ca3" style="background-color: #3a0ca3;" type="radio" name="option"/>
                                <input class="color" id="#3f37c9" style="background-color: #3f37c9;" type="radio" name="option"/>
                                <input class="color" id="#4262f0" style="background-color: #4262f0;" type="radio" name="option"/>
                                <input class="color" id="#4CC9F0" style="background-color: #4CC9F0;" type="radio" name="option"/>
                            </div>
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
                        };
                        $(document.body).append(div);
                        $ `.noteEditor`.each((item) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device == "mobile" ? "full" : "compact", "active");
                        $(elements.textField.noteHeader()).element.focus();
                        var colors = [...elements.navBar.colorBar.colors];
                        var color = currentNote.COLOR;
                        $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                        $(elements.topBar).css.background = `${color}`;
                        colors.forEach((colorItem) => {
                            if (colorItem.id == color) {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                            }
                            colorItem.addEventListener("click", () => {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(elements.topBar).css.background = `${color}`;
                            });
                        });
                        $(elements.textField.noteValue()).on("input", () => elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText));
                        $(elements.navBar.toMarkdownBtn).On(["click", "keyup"], (event) => {
                            event.target.classList.toggle("active");
                            div.classList.toggle("side");
                            event.target.classList.contains("active") ? $(elements.previewPanel.this).css.display = "block" : $(elements.previewPanel.this).css.display = "none";
                            elements.previewPanel.preview.innerHTML = mk($(elements.textField.noteValue()).element.innerText);
                        }, true);
                        $(elements.navBar.saveButton).On(["click", "keyup"], (event) => {
                            let activeNoteEditor = event.target?.parentElement?.parentElement.parentElement;
                            headerValue = $(activeNoteEditor.children[1].children[0]).value;
                            noteValue = $(activeNoteEditor.children[1].children[2]).element.innerHTML;
                            $(activeNoteEditor.children[1].children[2]).element.innerHTML = noteValue.replace(/<b>(.*?)<\/b>/g, "**$1**");
                            $(activeNoteEditor.children[1].children[2]).element.innerHTML = $(activeNoteEditor.children[1].children[2]).element.innerHTML.replace(/<i>(.*?)<\/i>/g, "_$1_");
                            noteValue = $(activeNoteEditor.children[1].children[2]).text;
                            if (headerValue.trim() || noteValue.trim()) {
                                activeNoteEditor.style.transition = "left 1s ease";
                                device == "desktop" ? activeNoteEditor.style.left = `${window.outerWidth}px` : activeNoteEditor.remove();
                                elements.previewPanel.this.remove();
                                notes[index] = {
                                    TITLE: headerValue,
                                    NOTE: noteValue,
                                    Pinned: currentNote.Pinned,
                                    Checked: currentNote.Checked,
                                    TIME: fullDate,
                                    COLOR: color,
                                    TYPE: subType
                                };
                                localStorage.setItem("Notes", JSON.stringify(notes));
                                refreshNotes();
                                $ `note`.all()[index].classList.add("edited");
                                setTimeout(() => activeNoteEditor.remove(), 1000);
                            }
                        }, true);
                        break;
                    case "ls":
                        $(div).HTML(`
                        <div class="topBar">
                            <div style="display: flex; gap: 5px;">
                                <div id="NOTEEDITOR_CLOSE" title="Close" type="button"></div>
                                <div id="NOTEEDITOR_MINIMIZE" title="Minimize" type="button"></div>
                                <div id="NOTEEDITOR_MAXIMIZE" title="Maximize" type="button"></div>
                            </div>
                            <div id="NOTEEDITOR_TYPE">Edit</div>
                            <div id="NOTEEDITOR_TIME">${fullDate}</div>
                        </div>
                        <div class="textField">
                            <input id="HEADER_VALUE" autofocus type="text" autocomplete="off" placeholder="Header of my note" value="${currentNote.TITLE}">
                            <div class="wrper"><div class="divider"></div></div>
                            <div class="noteText"></div>
                        </div>
                        <nav class="navBar">
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
                            <div class="btnGrp">
                                <ion-icon name="add-outline" class="addNewLineBtn editorNavBtn" type="button" tabindex="0" title="Add new line"></ion-icon>
                                <ion-icon name="arrow-forward-outline" class="saveButton editorNavBtn" type="button" tabindex="0" title="Save"></ion-icon>
                            </div>
                        </nav>
                        `);
                        currentNote.NOTE.split("\n").forEach((str) => {
                            let isChecked = !!str.split("✔️")[1];
                            div.children[1].children[2].innerHTML += `<li class="note_item ${isChecked ? "done" : ""}" id="checklist"><input class="checkBox" type="checkbox" ${isChecked && "checked"}/><label class="text" contenteditable>${str.split("✔️")[1] || str}</label></li>`;
                        });
                        $(document.body).append(div);
                        $ `.noteEditor`.each((item) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", device == "mobile" ? "full" : "compact", "active");
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
                        };
                        $(elements.textField.noteHeader()).element.focus();
                        var colors = $ `.noteEditor.active .colorBar > .color`.all();
                        var color = currentNote.COLOR;
                        $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                        $(elements.topBar).css.background = `${color}`;
                        [...elements.textField.list_items()].forEach((elem) => {
                            $(elem.children[0]).On(["click", "keyup"], () => {
                                elem.classList.toggle("done");
                            });
                        });
                        colors.forEach((colorItem) => {
                            if (colorItem.id == color) {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                            }
                            colorItem.onclick = () => {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            };
                        });
                        let lastElement = elements.textField.list_items()[elements.textField.list_items().length - 1];
                        $(lastElement.children[1]).on("keydown", (e) => {
                            if (e.key == "Enter") {
                                e.preventDefault();
                                addNewLine();
                            }
                        });
                        $(elements.navBar.addNewLineBtn).On(["click", "keyup"], () => addNewLine());
                        $(elements.navBar.saveButton).On(["click", "keyup"], () => {
                            if (lastElement.children[1].innerHTML) {
                                let values = [];
                                [...elements.textField.list_items()].forEach((item) => {
                                    var currentValue = item.children[1].innerHTML;
                                    let isChecked = item.children[0]?.checked;
                                    values.push(isChecked ? "✔️" + currentValue : currentValue);
                                });
                                div.style.transition = "left 1s ease";
                                device == "desktop" ? div.style.left = `${window.outerWidth}px` : div.remove();
                                notes[index] = {
                                    TITLE: elements.textField.noteHeader().value,
                                    NOTE: values.join("\n"),
                                    Pinned: currentNote.Pinned,
                                    Checked: currentNote.Checked,
                                    TIME: fullDate,
                                    COLOR: color,
                                    TYPE: subType
                                };
                                localStorage.setItem("Notes", JSON.stringify(notes));
                                refreshNotes();
                                $ `note`.all()[index].classList.add("edited");
                                setTimeout(() => div.remove(), 1000);
                            }
                        });
                        function addNewLine() {
                            if (lastElement.children[1].innerHTML) {
                                lastElement.insertAdjacentHTML("afterend", `<li class="note_item" id="checklist"><input class="checkBox" type="checkbox"/><label class="text" contenteditable></label></li>`);
                                lastElement = elements.textField.list_items()[elements.textField.list_items().length - 1];
                                lastElement.children[1].focus();
                                $(lastElement).on("keydown", (e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault();
                                        addNewLine();
                                    }
                                });
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
                let currentDiv;
                let isDown;
                $(topBar).on('mousedown', function (e) {
                    isDown = true;
                    const offset = [
                        div.offsetLeft - e.clientX,
                    ];
                    div.setAttribute('data-offset', JSON.stringify(offset));
                    currentDiv = div;
                });
                $(topBar).on('touchstart', function (event) {
                    isDown = true;
                    const offset = [
                        div.offsetLeft - event.touches[0].clientX,
                    ];
                    div.setAttribute('data-offset', JSON.stringify(offset));
                    currentDiv = div;
                });
                document.addEventListener('mouseup', () => isDown = false, true);
                document.addEventListener('touchend', () => isDown = false, true);
                document.addEventListener('mousemove', (event) => {
                    event.preventDefault();
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.clientX,
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = (mousePosition.x + offset[0]) + 'px';
                    }
                }, true);
                document.addEventListener('touchmove', (event) => {
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.touches[0].clientX,
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = (mousePosition.x + offset[0]) + 'px';
                    }
                }, { passive: true });
            })();
            $("#NOTEEDITOR_CLOSE").each((element) => { $(element).on("click", () => element.parentElement?.parentElement?.parentElement?.remove()); });
            if (device == "desktop") {
                $("#NOTEEDITOR_MINIMIZE").each((element) => {
                    $(element).on("click", () => {
                        element.parentElement?.parentElement?.parentElement?.classList.add("compact");
                        element.parentElement?.parentElement?.parentElement?.classList.remove("full");
                    });
                });
                $("#NOTEEDITOR_MAXIMIZE").each((element) => {
                    $(element).on("click", () => {
                        element.parentElement?.parentElement?.parentElement?.classList.add("full");
                        element.parentElement?.parentElement?.parentElement?.classList.remove("compact");
                    });
                });
            }
        }
    }
}
