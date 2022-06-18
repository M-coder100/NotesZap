/* ====================================
*  NotesZap ~ Notes taking, redesigned.
*  -- -- -- -- -- BETA -- -- -- -- -- -
*  ====================================
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
        <span style="color: white;">Notes<span style="font-weight: 800;">Zap</span> ( BETA 0.10 )</span>
    </nav>
    <div class="main">
        <img src="src/Logo.image.png" class="logo"/>
        <div class="desc">
            <h1 class="header">Notes taking, <br>redesigned</h1>
            Welcome to the new era of notes taking. Make more notes beautiful than ever and help yourself to remember things faster and better.
            <button id="CLOSE" autofocus>Get Started</button>
        </div>  
    </div>
    `);
}
else
    $ `.popupContainer`.remove();
const sorts = {
    sortType: $ `#SORT_BY`.element,
    noteType: $ `#NOTE_TYPE`.element,
    viewType: $ `#VIEW_TYPE`.element
};
const getfullDate = () => `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
const device = (() => window.innerWidth <= 550 ? "mobile" : "desktop")();
const d = new Date();
$ `#SEARCH`.on("input", () => {
    if ($ `#SEARCH`.value && localStorage.getItem("Notes")) {
        $ `note`?.each((element) => element.remove());
        let ofDB = arraySearch($ `#SEARCH`.value, JSON.parse(localStorage.getItem("Notes") || "{}"));
        renderNotes(ofDB);
    }
    else
        refreshNotes();
});
$(document).on("keydown", (e) => {
    if (isFinite(Number(e.key)) && e.ctrlKey) {
        e.preventDefault();
        document.getElementById(`${Number(e.key) - 1}`)?.focus();
        Number(e.key) == 0 && document.getElementById("9")?.focus();
    }
    if (((e.key == "+") || (e.key == "=")) && ($ `.noteEditor`.all().length == 0) && !document.querySelector(":focus")) {
        new NoteEditor("Create", sorts.noteType.value);
        $ `.noteEditor`.addClass("active");
    }
    else if (e.key == "Escape" && $ `.noteEditor`.all().length > 0) {
        $ `.noteEditor.active`.remove();
        $ `.noteEditor`.addClass("active");
    }
});
$("#ADD_NEW_NOTE_BUTTON").On(["click", "keyup"], () => {
    if (($ `.noteEditor`.all().length <= 2)) {
        new NoteEditor("Create", sorts.noteType.value);
    }
    else {
        alert("Maximum create note editors reached.");
    }
});
let rotation = 360;
$ `.refreshNotesBtn`.On(["click", "keyup"], () => {
    $ `.refreshNotesBtn`.css.transform = `rotate(${rotation}deg)`;
    rotation += 360;
    refreshNotes();
});
export { getfullDate, device };
(() => {
    let QsParsed = Qs?.parse(location.search, { ignoreQueryPrefix: true });
    if (QsParsed?.ex) {
        $ `#NOTES_CONTAINER`.HTML `<div id="PINNED"></div>`;
        $ `#NOTES_CONTAINER > #PINNED`.HTML `<note style="padding: 10px; text-align: center;"><h1>You are currently in Experiment Mode</h1><a href="/">Click here to go back</a></note>`;
        renderNotes([{ "TITLE": "", "NOTE": "| Notes Zap |\n|:-:|\n|![NotesZap Logo](./src/Logo.round.png 'NotesZap')|\n> Share: <https://notes-zap.web.app/>", "Pinned": false, "Checked": false, "TIME": "4/25/2022", "COLOR": "#6410D0", "TYPE": "mk" }, { "TITLE": "Important snippet for interview", "NOTE": "```\nconst name = \"MODE\";\nfunction greet(str) {\n   console.log(\"Welcome \" + str);\n}\n```\n```js\ngreet(name)\n```", "Pinned": false, "Checked": false, "TIME": "4/25/2022", "COLOR": "#6410D0", "TYPE": "mk" }, { "TITLE": "🧺 Groceries", "NOTE": "✔️Bread\nVegetables\n✔️Oreo (<i>biscuits</i>)\nMilk <b>&nbsp;2L</b>", "Pinned": false, "Checked": false, "TIME": "4/6/2022", "COLOR": "#f72585", "TYPE": "ls" }]);
    }
    if (QsParsed?.action == "newMkNote") {
        new NoteEditor("Create", "mk");
    }
    if (QsParsed?.action == "newLsNote") {
        new NoteEditor("Create", "ls");
    }
})();
