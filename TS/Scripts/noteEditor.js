import { getfullDate } from "./app.js";
import makeNewNoteToDatabase from "./db.js";
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
                    case "pt":
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
                                <div class="color" id="0" style="background-color: #F72585;"></div>
                                <div class="color" id="1" style="background-color: #B5179E;"></div>
                                <div class="color selected" id="2" style="background-color: #7209B7;"></div>
                                <div class="color" id="3" style="background-color: #560BAD;"></div>
                                <div class="color" id="4" style="background-color: #480CA8;"></div>
                                <div class="color" id="5" style="background-color: #3A0CA3;"></div>
                                <div class="color" id="6" style="background-color: #3F37C9;"></div>
                                <div class="color" id="7" style="background-color: #4262F0;"></div>
                                <div class="color" id="8" style="background-color: #4895EF;"></div>
                                <div class="color" id="9" style="background-color: #4CC9F0;"></div>
                            </div>
                            <ion-icon name="arrow-forward-outline" class="saveButton" type="button" tabindex="0" title="Save"></ion-icon>
                        </nav>

                        `);
                        $(document.body).append(div);
                        $(div).addClass("noteEditor", "compact");
                        $ `.saveButton`.each((element) => {
                            $(element).on("click", () => {
                                headerValue = $ `#HEADER_VALUE`.value;
                                noteValue = $ `.noteText`.text;
                                let activeNoteEditor = $ `.noteEditor.active`;
                                if (headerValue.trim() || noteValue.trim()) {
                                    activeNoteEditor.css.transition = "left 1s ease";
                                    activeNoteEditor.css.left = `${screen.width}px`;
                                    makeNewNoteToDatabase({
                                        TITLE: headerValue,
                                        NOTE: noteValue,
                                        Pinned: false,
                                        Checked: false,
                                        TIME: fullDate,
                                        TYPE: subType
                                    });
                                    setTimeout(() => activeNoteEditor.remove(), 1000);
                                }
                            });
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
                switch (subType) {
                    case "pt":
                        const notes = JSON.parse(localStorage.getItem("Notes"));
                        const currentNote = notes[index];
                        console.log(currentNote);
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
                                <div class="color" id="0" style="background-color: #F72585;"></div>
                                <div class="color" id="1" style="background-color: #B5179E;"></div>
                                <div class="color selected" id="2" style="background-color: #7209B7;"></div>
                                <div class="color" id="3" style="background-color: #560BAD;"></div>
                                <div class="color" id="4" style="background-color: #480CA8;"></div>
                                <div class="color" id="5" style="background-color: #3A0CA3;"></div>
                                <div class="color" id="6" style="background-color: #3F37C9;"></div>
                                <div class="color" id="7" style="background-color: #4262F0;"></div>
                                <div class="color" id="8" style="background-color: #4895EF;"></div>
                                <div class="color" id="9" style="background-color: #4CC9F0;"></div>
                            </div>
                            <ion-icon name="arrow-forward-outline" class="saveButton" type="button" tabindex="0" title="Save"></ion-icon>
                        </nav>

                        `);
                        $(document.body).append(div);
                        $(div).addClass("noteEditor", "compact");
                        $ `.saveButton`.each((element) => {
                            $(element).on("click", () => {
                                headerValue = $ `#HEADER_VALUE`.value;
                                noteValue = $ `.noteText`.text;
                                let activeNoteEditor = $ `.noteEditor.active`;
                                if (headerValue.trim() || noteValue.trim()) {
                                    activeNoteEditor.css.transition = "left 1s ease";
                                    activeNoteEditor.css.left = `${screen.width}px`;
                                    notes[index] = {
                                        TITLE: headerValue,
                                        NOTE: noteValue,
                                        Pinned: false,
                                        Checked: false,
                                        TIME: fullDate,
                                        TYPE: subType
                                    };
                                    localStorage.setItem("Notes", JSON.stringify(notes));
                                    setTimeout(() => activeNoteEditor.remove(), 1000);
                                }
                            });
                        });
                        break;
                    default:
                        break;
                }
                break;
            default:
                console.log("Error in type!");
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
