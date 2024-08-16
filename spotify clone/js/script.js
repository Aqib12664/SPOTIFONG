console.log("CODSE IS RUNNING");
// checkin if Fetch is working

let currentSong = new Audio();

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
                songs.push(element.href.split("/songs/")[1])//.split will give text after /songs/ "http://127.0.0.1:5500/songs/Bad%20Days.mp3"
            }
        }
        //console.log(songs);

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];

    }
}



getSongs()// running getsongs( function)


const playMusic = (track) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = "/songs/" + track;
    currentSong.play()
    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {



    //get the list of all songs
    let songs = await getSongs()
    console.log(songs)
    //Show alla the song in the songlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img src="img/music.svg" alt="" class="invert">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Song Artist</div>
              </div>
              <div class="playnow">
                <span>Play Now</span>
                <img src="img/play.svg" alt="" class="invert">
              </div> </li>`

    }

    //attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())//.trim remove spaces

        })




    });

    //attach an event listener to previous,play,next
    play.addEventListener("click", () => {
        if (currentSong.paused && currentSong.src) {
            currentSong.play();
            play.src = "img/pause.svg"; // Change button to pause when music starts
        } else {
            currentSong.pause();
            play.src = "img/play.svg"; // Change button to play when music pauses
        }
    });



}
main() // running main function
