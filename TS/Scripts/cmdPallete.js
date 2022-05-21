import $ from "./tquery.js";
document.addEventListener("keyup", (e) => {
    const { key, ctrlKey } = e;
    if (key == "Z" && ctrlKey) {
        new CMDPallete();
    }
});
let cmdList = [
    {
        name: "Undo",
        shortcut: ["Ctrl", "Z"],
        from: "Editor"
    },
    {
        name: "Redo",
        shortcut: ["Ctrl", "Y"],
        from: "Editor"
    },
    {
        name: "New note",
        shortcut: ["+"],
        from: "Application"
    },
    {
        name: "Save current note",
        shortcut: ["Ctrl", "S"],
        from: "Application"
    },
    {
        name: "Close",
        shortcut: ["Esc"],
        from: "Window/Popup"
    },
    {
        name: "Open command pallete",
        shortcut: ["Ctrl", "Shift", "Z"],
        from: "Application"
    },
    {
        name: "Reload app",
        shortcut: ["Ctrl", "R"],
        from: "Application"
    }
];
class CMDPallete {
    constructor() {
        const cmd_pallete_container = $ `div`.create(true);
        $(cmd_pallete_container).HTML(`
            <nav class="CMD_pallete">
                <div class="topbar">
                    <input class="search_box" type="search" title="Type your command"/>
                </div> 
                <div class="search_suggestions"></div>
            </nav>
        `);
        cmd_pallete_container.classList.add("cmd_pallete_container");
        cmdList.forEach((elem) => {
            let shortcutKBD = [];
            elem.shortcut.forEach((element) => {
                shortcutKBD.push(`<kbd>${element}</kbd>`);
            });
            $ `.search_suggestions`.element.insertAdjacentHTML("beforeend", `
            <div class="search_suggestion" tabindex="0">
                <div class="command_name">${`<span class="from">${elem.from}: </span>` + elem?.name}</div>
                <div class="shortcut" title="Keyboard Shortcut">${shortcutKBD.join(" + ")}</div>
            </div>
            `);
        });
        var inputArea = cmd_pallete_container.querySelector("input");
        inputArea.focus();
        inputArea.value = "> ";
    }
}
