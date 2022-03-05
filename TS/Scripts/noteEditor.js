import { getfullDate } from "./app.js";
import makeNewNoteToDatabase from "./db.js";
import refreshNotes from "./notes.js";
import $ from "./tquery.js";
export default class NoteEditor {
    constructor(type, subType, index) {
        const div = $ `div`.create();
        let headerValue;
        let noteValue;
        let fullDate = getfullDate();
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
                                <div class="color" id="#7fff00" style="background: #7fff00;"></div>
                                <div class="color" id="#ffa72d" style="background: #ffa72d;"></div>
                                <div class="color" id="#ff5d5d" style="background: #ff5d5d;"></div>
                                <div class="color" id="#f72585" style="background: #f72585;"></div>
                                <div class="color" id="#800080" style="background: #800080;"></div>
                                <div class="color selected" id="#560bad" style="background: #560bad;"></div>
                                <div class="color" id="#3a0ca3" style="background: #3a0ca3;"></div>
                                <div class="color" id="#3f37c9" style="background: #3f37c9;"></div>
                                <div class="color" id="#4262f0" style="background: #4262f0;"></div>
                                <div class="color" id="#4CC9F0" style="background: #4CC9F0;"></div>
                            </div>
                            <ion-icon name="arrow-forward-outline" class="saveButton" type="button" tabindex="0" title="Save"></ion-icon>
                        </nav>

                        `);
                        $(document.body).append(div);
                        $ `.noteEditor`.each((item) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", "compact", "active");
                        let colors = $ `.noteEditor.active .colorBar > .color`.all();
                        let color = "#560bad";
                        colors.forEach((colorItem) => {
                            colorItem.onclick = () => {
                                colors.forEach((elem) => elem.classList.remove("selected"));
                                colorItem.classList.add("selected");
                                color = colorItem.id;
                                $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                                $(div.children[0]).css.background = `${color}`;
                            };
                        });
                        $(div.children[2].children[1]).on("click", () => {
                            headerValue = $(div.children[1].children[0]).value;
                            noteValue = $(div.children[1].children[2]).text;
                            let activeNoteEditor = $ `.noteEditor.active`;
                            if (headerValue.trim() || noteValue.trim()) {
                                activeNoteEditor.css.transition = "left 1s ease";
                                activeNoteEditor.css.left = `${window.innerWidth}px`;
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
                                $ `#NOTES_CONTAINER > note:last-child`.addClass("new");
                                setTimeout(() => activeNoteEditor.remove(), 1000);
                            }
                        });
                        break;
                    case "ls":
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
                    case "kb":
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
                switch (subType) {
                    case "mk":
                        const notes = JSON.parse(localStorage.getItem("Notes"));
                        const currentNote = notes[index];
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
                                <div class="color" id="#7fff00" style="background-color: #7fff00;"></div>
                                <div class="color" id="#ffa72d" style="background-color: #ffa72d;"></div>
                                <div class="color selected" id="#ff5d5d" style="background-color: #ff5d5d;"></div>
                                <div class="color" id="#f72585" style="background-color: #f72585;"></div>
                                <div class="color" id="#800080" style="background-color: #800080;"></div>
                                <div class="color" id="#560bad" style="background-color: #560bad;"></div>
                                <div class="color" id="#3a0ca3" style="background-color: #3a0ca3;"></div>
                                <div class="color" id="#3f37c9" style="background-color: #3f37c9;"></div>
                                <div class="color" id="#4262f0" style="background-color: #4262f0;"></div>
                                <div class="color" id="#4CC9F0" style="background-color: #4CC9F0;"></div>
                            </div>
                            <ion-icon name="arrow-forward-outline" class="saveButton" type="button" tabindex="0" title="Save"></ion-icon>
                        </nav>

                        `);
                        $(document.body).append(div);
                        $ `.noteEditor`.each((item) => item.classList.remove("active"));
                        $(div).addClass("noteEditor", "compact", "active");
                        let colors = [...div.children[2].children[0].children];
                        let color = currentNote.COLOR;
                        $(div).css.background = `linear-gradient(to bottom,  ${color}a1, #800080b0)`;
                        $(div.children[0]).css.background = `${color}`;
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
                                $(div.children[0]).css.background = `${color}`;
                            });
                        });
                        $(div.children[2].children[1]).on("click", (event) => {
                            let activeNoteEditor = event.target?.parentElement?.parentElement;
                            headerValue = $(activeNoteEditor.children[1].children[0]).value;
                            noteValue = $(activeNoteEditor.children[1].children[2]).text;
                            if (headerValue.trim() || noteValue.trim()) {
                                activeNoteEditor.style.transition = "left 1s ease";
                                activeNoteEditor.style.left = `${window.innerWidth}px`;
                                notes[index] = {
                                    TITLE: headerValue,
                                    NOTE: noteValue,
                                    Pinned: false,
                                    Checked: false,
                                    TIME: fullDate,
                                    COLOR: color,
                                    TYPE: subType
                                };
                                localStorage.setItem("Notes", JSON.stringify(notes));
                                refreshNotes();
                                $ `note`.all()[index].classList.add("edited");
                                setTimeout(() => activeNoteEditor.remove(), 1000);
                            }
                        });
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
                document.addEventListener('mouseup', function () {
                    isDown = false;
                }, true);
                document.addEventListener('mousemove', function (event) {
                    event.preventDefault();
                    if (isDown && currentDiv) {
                        const mousePosition = {
                            x: event.clientX,
                        };
                        const offset = JSON.parse(currentDiv.getAttribute('data-offset'));
                        currentDiv.style.left = (mousePosition.x + offset[0]) + 'px';
                    }
                }, true);
            })();
            $("#NOTEEDITOR_CLOSE").each((element) => { $(element).on("click", () => element.parentElement?.parentElement?.parentElement?.remove()); });
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
