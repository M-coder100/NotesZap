const data = await fetch("/version.json").then(res => res.json());
localStorage.getItem("version") || localStorage.setItem("version", "0.01");
let lastVersion = Number(localStorage.getItem("version"))
if (data.version > lastVersion) {
    caches.delete("offline_cache").then(console.log("cache cleared...")).then(() => console.log("Updated successfully"));
    localStorage.setItem("version", `${data.version}`)
} else {
    console.log("%c✨ You are in the latest version! ✨", StyleSheet="color: yellow; background: black; padding: 5px;");
}