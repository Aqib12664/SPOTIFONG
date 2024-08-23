console.log("CODE IS RUNNING");

// Define the current song in the global scope
let currentSong = new Audio();
let songs;
let isMuted = false; // Track the mute state
let lastVolume = 1; // Track the last volume level before muting
let currFolder;

async function getSongs(folder) {
    try {
        currFolder = folder;
        let a = await fetch(`/${folder}/`);
        
        if (!a.ok) {
            throw new Error(`HTTP error! status: ${a.status}`);
        }

        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a"); // "a" is anchor tag
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1].replace(".mp3", "")); // Removing ".mp3"
            }
        }

        // Show all the songs in the songlist
        let songUL = document.querySelector(".songlist ul");
        songUL.innerHTML = "";
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
            e.addEventListener("click", () => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });

        return songs;

    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track + ".mp3"; // Adding ".mp3" back when playing 
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

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

async function displayAlbums() {
    try {
        let a = await fetch(`/songs/`);

        if (!a.ok) {
            throw new Error(`HTTP error! status: ${a.status}`);
        }

        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardcontainer");
        let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs/")) {
                let folder = e.href.split("/").slice(4)[0].replaceAll("%20", " ");
                // Meta data for folder
                let a = await fetch(`/songs/${folder}/info.json`);
                
                if (!a.ok) {
                    console.error(`Error fetching info.json for folder ${folder}: HTTP error! status: ${a.status}`);
                    continue;
                }
                
                let response = await a.json();
                cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <img src="/songs/${folder}/cover.jpg" alt="" />
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                    <div class="play">
                        <svg width="24px" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#00FF00" />
                            <path d="M9 16V8L15 12L9 16Z" fill="#000000" stroke="#000000" stroke-width="1.5"
                                  stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>`;
            }
        }

        // Load the playlist when card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0]); // Play the first song in the folder
            });
        });

    } catch (error) {
        console.error("Error displaying albums:", error);
    }
}

async function main() {
    // Get the list of all songs
    songs = await getSongs("songs/ncs");

    // Display all albums
    displayAlbums();

    if (songs.length > 0) {
        playMusic(songs[0], true); // Play an initial music track for playing
    }

    // Attach an event listener to previous, play, next
    const playButton = document.getElementById("play");
    playButton.addEventListener("click", () => {
        if (currentSong.paused && currentSong.src) {
            currentSong.play();
            playButton.src = "img/pause.svg"; // Change button to pause when music starts
        } else {
            currentSong.pause();
            playButton.src = "img/play.svg"; // Change button to play when music pauses
        }
    });

    // Event listener for previous button
    const previousButton = document.getElementById("previous");
    previousButton.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replace(".mp3", ""));
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // Event listener for next button
    const nextButton = document.getElementById("next");
    nextButton.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replace(".mp3", ""));
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.duration) {
            progress.max = currentSong.duration;
            progress.value = currentSong.currentTime;
            const percentage = (currentSong.currentTime / currentSong.duration) * 100;
            progress.style.background = `linear-gradient(to right, #00FF00 ${percentage}%, #ccc ${percentage}%)`;
        }
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    });

    // Allow user to seek by dragging the range input
    progress.addEventListener("input", (e) => {
        currentSong.currentTime = e.target.value;
        const percentage = (e.target.value / currentSong.duration) * 100;
        progress.style.background = `linear-gradient(to right, #00FF00 ${percentage}%, #ccc ${percentage}%)`;
    });
}

// Add an event listener for Hamburger button
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});

// Add an event to volume
const volumeInput = document.querySelector(".volume input");
volumeInput.addEventListener("input", (e) => {
    const volume = parseInt(e.target.value) / 100;
    if (volume === 0) {
        currentSong.volume = 0;
        isMuted = true;
        volimg.src = "img/mute.svg";
    } else {
        currentSong.volume = volume;
        lastVolume = volume;
        isMuted = false;
        volimg.src = "img/volume.svg";
    }
});

// Add mute/unmute functionality
const volimg = document.getElementById("volimg");
volimg.addEventListener("click", () => {
    if (isMuted) {
        // Unmute
        currentSong.volume = lastVolume;
        volumeInput.value = lastVolume * 100;
        volimg.src = "img/volume.svg";
    } else {
        // Mute
        currentSong.volume = 0;
        volumeInput.value = 0;
        volimg.src = "img/mute.svg";
    }
    isMuted = !isMuted;
});

main(); // Running main function
