export default function makeNewNoteToDatabase(props) {
    if (!props)
        return;
    if (!localStorage.getItem("Notes")) {
        localStorage.setItem("Notes", JSON.stringify([props]));
    }
    else {
        let notes = JSON.parse(localStorage.getItem("Notes") || "{}");
        notes.push(props);
        function uniqBy(a) {
            let seen = new Set();
            return a.filter(item => {
                let k = JSON.stringify(item);
                return seen.has(k) ? console.log("Has") : seen.add(k);
            });
        }
        console.log("exec");
        localStorage.setItem("Notes", JSON.stringify(uniqBy(notes)));
    }
}
