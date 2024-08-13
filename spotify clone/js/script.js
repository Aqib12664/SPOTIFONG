console.log("CODSE IS RUNNING");
// checkin if Fetch is working



async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text() // text() giives contents of elements
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")//WHERE "a" is anchor tab
    // console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    console.log(songs);
    
   return songs
}

getSongs()// must run function

