const mk = (value) => new Remarkable("full", {
    breaks: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            }
            catch (err) { }
        }
        try {
            return hljs.highlightAuto(str).value;
        }
        catch (err) { }
        return ''; // use external default escaping
    }
}).render(value);
function replaceURLs(text) {
    if (!text)
        return;
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        var hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
        }
        return `[${hyperlink}](${hyperlink})`;
    });
}
function arraySearch(text, array) {
    text.trim();
    let searchedItems = [];
    for (let i = 0; i < array.length; i++) {
        let txt = array[i].TITLE.toLowerCase() || array[i].NOTE.toLowerCase();
        if (txt.split(text.toLowerCase()) != txt)
            searchedItems.push({
                NOTE: array[i].NOTE,
                TIME: array[i].TIME,
                COLOR: array[i].COLOR,
                TITLE: array[i].TITLE,
                Pinned: array[i].Pinned,
                Checked: array[i].Checked,
                TYPE: array[i].TYPE
            });
    }
    return !searchedItems[0] ? [{
            TITLE: "Sorry! Couldn't find the note.",
            TYPE: "msg"
        }] : searchedItems;
}
export { mk, replaceURLs, arraySearch };
