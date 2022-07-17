/* ====================================
*  NotesZap ~ Notes taking, redesigned.
*  -- -- -- -- -- BETA -- -- -- -- -- - 
*  ====================================
*/

import $ from "./tquery.js";
import NoteEditor from "./noteEditor.js";
import { renderNotes, refreshNotes, clearNotes } from "./notes.js";
import popup from "./popup.js";
import { arraySearch, sort } from "./utils.js";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
if (!localStorage.getItem("Notes")) {
    new popup(`
    <nav class="PtopBar">
        <ion-icon name="close-outline" id="CLOSE" tabindex="0"></ion-icon>
        <span style="color: white;">Notes<span style="font-weight: 800;">Zap</span> ( BETA 0.25 Major update )</span>
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
} else $`.popupContainer`.remove();
const getfullDate = () => `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
const device = () => window.innerWidth <= 550 ? "mobile" : "desktop";
const d = new Date();
$`#SEARCH`.on("input", () => {
    if ($`#SEARCH`.value && localStorage.getItem("Notes")) {
        $`note`?.each((element: Element) => element.remove())
        let ofDB: any = arraySearch($`#SEARCH`.value, JSON.parse(localStorage.getItem("Notes") || "{}"));
        renderNotes(ofDB);
    } else refreshNotes();
})

$(window).On(["scroll", "resize"],() => {
    if (window.innerWidth <= 1330) {
        if (window.scrollY > 45) {
            $("nav.topBar").css.position = "fixed";
            $("nav.topBar").css.top = "0";
        } else $("nav.topBar").css.top = "60px";
    } else $("nav.topBar").css.top = "0";
})
$("#SORT_BY").on("input", () => {
    clearNotes();
    renderNotes(sort($`#SORT_BY`.value, JSON.parse(localStorage.getItem("Notes") || "{}")));
    console.log("SORT:", $`#SORT_BY`.value);
})
$(document).on("keyup", (e: KeyboardEvent) => {
    // Keyboard controller
    if (isFinite(Number(e.key)) && (!$`:focus`.element || $`note:focus`.element)) {
        e.preventDefault();
        document.getElementById(`${Number(e.key)-1}`)?.focus();
        Number(e.key) == 0 && (document.querySelector("note#9") as HTMLInputElement)?.focus();
    }    
    if (((e.key == "+") || (e.key == "=")) && ($`.noteEditor`.all().length == 0) && !document.querySelector(":focus")) {$("#ADD_NEW_NOTE_BUTTON").element.click() }
    else if (e.key == "Escape" && $`.noteEditor`.all().length > 0) {$`.noteEditor.active`.remove(); $`.noteEditor`?.addClass("active");}
})
let clicked = false;
$("ion-icon.openCollectionsBtn").on("click", () => {
    $(".collectionGrp").addClass("enter");
    wait(100).then(() => $(document).on("click", (e: MouseEvent) => {
        if (e.target != $(".collectionGrp").element) {
            $(".collectionGrp").removeClass("enter");
            $(".collectionGrp").addClass("fade-out");
            wait(500).then(() => $(".collectionGrp").removeClass("fade-out"));
        }
    }, {once: true}));
})
$(".newNoteBtn").on("click", () => { new NoteEditor("Create", "mk") });
$("#ADD_NEW_NOTE_BUTTON").On(["click", "keyup"], () => {
    function rmvAnimation () {
        $(".collectionGrp").removeClass("fade-out")
        $("#ADD_NEW_NOTE_BUTTON").removeClass("rotate");
        $(".noteTypeWrper").removeClass("active");
    }
    if (window.innerWidth >= 1330) {
        if(!clicked) {
            $(".collectionGrp").addClass("fade-out")
            $("#ADD_NEW_NOTE_BUTTON").addClass("rotate");
            $(".collectionGrp").on("animationend", () => {
                $(".noteTypeWrper").addClass("active");
            })
            clicked = true;
        } else {
            rmvAnimation();
            clicked = false;
        }
    
        if (($`.noteEditor`.all().length <= 2)) {
            $(".noteTypeWrper > div").On(["click", "keyup"], (e: Event) => {
                let tTe = e.target as HTMLElement;
                new NoteEditor("Create", tTe.getAttribute("data-type")||"mk");
                rmvAnimation();
                clicked = false;
            }, {once: true} )
        } else {
            alert("Maximum create note editors reached.")
        }
    } else {
        rmvAnimation();
        new NoteEditor("Create", $("#NOTE_TYPES").value);
    }
})

let rotation: number = 360;
$`.refreshNotesBtn`.On(["click", "keyup"], () => {
    $`.refreshNotesBtn`.css.transform = `rotate(${rotation}deg)`;
    rotation += 360;
    refreshNotes();
})
export { getfullDate, device }

(() => {
    let QsParsed = Qs?.parse(location.search, { ignoreQueryPrefix: true })
    if (QsParsed?.ex) {
        $`#NOTES_CONTAINER`.HTML`<div id="PINNED"></div>`
        $`#NOTES_CONTAINER > #PINNED`.HTML`<note style="padding: 10px; text-align: center;"><h1>You are currently in Experiment Mode</h1><a href="/">Click here to go back</a></note>`;     
        renderNotes([{"TITLE":"","NOTE":"| Notes Zap |\n|:-:|\n|![NotesZap Logo](./src/Logo.round.png 'NotesZap')|\n> Share: <https://notes-zap.web.app/>","Pinned":false,"Checked":false,"TIME":"4/25/2022","COLOR":"#6410D0","TYPE":"mk"},{"TITLE":"Important snippet for interview","NOTE":"```\nconst name = \"MODE\";\nfunction greet(str) {\n   console.log(\"Welcome \" + str);\n}\n```\n```js\ngreet(name)\n```","Pinned":false,"Checked":false,"TIME":"4/25/2022","COLOR":"#6410D0","TYPE":"mk"},{"TITLE":"🧺 Groceries","NOTE":"✔️Bread\nVegetables\n✔️Oreo (<i>biscuits</i>)\nMilk <b>&nbsp;2L</b>","Pinned":false,"Checked":false,"TIME":"4/6/2022","COLOR":"#f72585","TYPE":"ls"}]);
    }
    if (QsParsed?.action == "newMkNote") {
        new NoteEditor("Create", "mk");
    }
    if (QsParsed?.action == "newLsNote") {
        new NoteEditor("Create", "ls");
    }
})()