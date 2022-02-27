export default function makeNewNoteToDatabase(props: object) {
    if (!props) return;

    if (!localStorage.getItem("Notes")) {
        localStorage.setItem("Notes", JSON.stringify([props]))
    }
    else {
        let notes: any[] = JSON.parse(localStorage.getItem("Notes"))
        notes.push(props);
        function uniqBy(a: any[]) {
            let seen = new Set();
            return a.filter(item => {
                let k = JSON.stringify(item);
                return seen.has(k) ? false : seen.add(k);
            });
        }
        localStorage.setItem("Notes", JSON.stringify(uniqBy(notes)));
    }
}