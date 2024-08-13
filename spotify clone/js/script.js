console.log("CODSE IS RUNNING");
// checkin if Fetch is working



async function getSongs() {
    try {
        let a = await fetch("http://127.0.0.1:5500/songs/")
        let response = await a.text() // .text() giives contents of elements
        // console.log(response);
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

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];

    }
}



getSongs()// running getsongs( function)

async function main() {
    //get the list of all songs
    let songs = await getSongs()
    console.log(songs)
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML + `<li> ${song}</li>`
        
    }
    
    //play th efirst song
    var audio = new Audio(songs[0])
//    audio.play();
    audio.addEventListener("loadeddata", () => {
        
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
        
        // The duration variable now holds the duration (in seconds) of the audio clip
      });
      
}
main() // running main function
