function makeNewNoteToDatabase(props: object) {
    if (!props) return;

    if (!localStorage.getItem("Notes")) {
        localStorage.setItem("Notes", JSON.stringify([props]))
    }
    else {
        let notes: object[] = JSON.parse(localStorage.getItem("Notes") || "{}")
        notes.unshift(props);
        function uniqBy(a: Array<object>) {
            let seen = new Set();
            return a.filter(item => {
                let k = JSON.stringify(item);
                return seen.has(k) ? false : seen.add(k);
            });
        }
        localStorage.setItem("Notes", JSON.stringify(uniqBy(notes)));
    }
}
type dbNoteType = {
    TITLE: string,
    NOTE: string,
    Pinned: boolean,
    Checked: boolean,
    TIME: string,
    COLOR: string,
    TYPE: string
}
export { makeNewNoteToDatabase, dbNoteType };