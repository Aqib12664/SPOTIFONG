console.log("CODE IS RUNNING");

// Define the current song in the global scope
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs() {
    try {
        let a = await fetch("http://127.0.0.1:5500/songs/");
        let response = await a.text(); // .text() giives contents of elements
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");//WHERE "a" is anchor tab
        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/songs/")[1].replace(".mp3", "")); // Removing ".mp3" //.split will give text after /songs/ "http://127.0.0.1:5500/songs/Bad%20Days.mp3"here

            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track + ".mp3"; // Adding ".mp3" back when playing 
    if (!pause) {

        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {



    // Get the list of all songs
    let songs = await getSongs();
    console.log(songs);

    playMusic(songs[6], true)//Play a initial music for playing when

    // Show all the songs in the songlist
    let songUL = document.querySelector(".songlist ul");
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img src="img/music.svg" alt="" class="invert">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Song Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="img/play.svg" alt="" class="invert">
                </div>
            </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelectorAll(".songlist li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    // Attach an event listener to previous, play, next
    const playButton = document.getElementById("play"); // Assuming you have an element with id="play"
    playButton.addEventListener("click", () => {
        if (currentSong.paused && currentSong.src) {
            currentSong.play();
            playButton.src = "img/pause.svg"; // Change button to pause when music starts
        } else {
            currentSong.pause();
            playButton.src = "img/play.svg"; // Change button to play when music pauses
        }
    });

    //Listen for time update event

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        if (currentSong.duration) {
            progress.max = currentSong.duration;
            progress.value = currentSong.currentTime;
            const percentage = (currentSong.currentTime / currentSong.duration) * 100;
            progress.style.background = `linear-gradient(to right, #00FF00 ${percentage}%, #ccc ${percentage}%)`;

            // Update the song time display
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        }
    })

    // Allow user to seek by dragging the range input
    progress.addEventListener("input", (e) => {
        currentSong.currentTime = e.target.value;
        const percentage = (e.target.value / currentSong.duration) * 100;
        progress.style.background = `linear-gradient(to right, #00FF00 ${percentage}%, #ccc ${percentage}%)`;
    });

    //Add an event listener for Hamburger btn
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"

    })
        //Add an event listener for  close btn
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%"

    })




}


main(); // Running main function

