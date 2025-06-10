// Track list (replace URLs with your actual audio files or links)
const tracks = [
  {
    name: "Energy",
    artist: "Bensound",
    image: "https://www.bensound.com/bensound-img/energy.jpg",
    path: "https://www.bensound.com/bensound-music/bensound-energy.mp3"
  },
  {
    name: "Sunny",
    artist: "Bensound",
    image: "https://www.bensound.com/bensound-img/sunny.jpg",
    path: "https://www.bensound.com/bensound-music/bensound-sunny.mp3"
  },
  {
    name: "Tenderness",
    artist: "Bensound",
    image: "https://www.bensound.com/bensound-img/tenderness.jpg",
    path: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3"
  },
  {
    name: "Creative Minds",
    artist: "Bensound",
    image: "https://www.bensound.com/bensound-img/creativeminds.jpg",
    path: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"
  },
  {
    name: "Going Higher",
    artist: "Bensound",
    image: "https://www.bensound.com/bensound-img/goinghigher.jpg",
    path: "https://www.bensound.com/bensound-music/bensound-goinghigher.mp3"
  }
];

// DOM elements
const nowPlaying = document.querySelector(".now-playing");
const trackArt = document.querySelector(".track-art");
const trackName = document.querySelector(".track-name");
const trackArtist = document.querySelector(".track-artist");

const playPauseBtn = document.getElementById("playpause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const seekSlider = document.getElementById("seek-slider");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");

const volumeSlider = document.getElementById("volume-slider");
const playlistEl = document.getElementById("playlist");

let trackIndex = 0;
let isPlaying = false;
let updateTimer;

const audio = new Audio();
audio.volume = volumeSlider.value / 100;

// Load a track
function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();

  audio.src = tracks[index].path;
  audio.load();

  trackArt.style.backgroundImage = `url(${tracks[index].image})`;
  trackName.textContent = tracks[index].name;
  trackArtist.textContent = tracks[index].artist;
  nowPlaying.textContent = `Playing ${index + 1} of ${tracks.length}`;

  highlightPlaylistItem();

  updateTimer = setInterval(seekUpdate, 500);
}

// Reset time and slider values
function resetValues() {
  currentTimeEl.textContent = "00:00";
  totalDurationEl.textContent = "00:00";
  seekSlider.value = 0;
}

// Play or pause toggle
function playPauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playPauseBtn.innerHTML = "&#10074;&#10074;"; // pause icon
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = "&#9654;"; // play icon
}

function nextTrack() {
  if (trackIndex < tracks.length - 1) trackIndex++;
  else trackIndex = 0;
  loadTrack(trackIndex);
  playTrack();
}

function prevTrack() {
  if (trackIndex > 0) trackIndex--;
  else trackIndex = tracks.length - 1;
  loadTrack(trackIndex);
  playTrack();
}

// Update seek slider and time
function seekUpdate() {
  if (!isNaN(audio.duration)) {
    const seekPosition = (audio.currentTime / audio.duration) * 100;
    seekSlider.value = seekPosition;

    // Calculate time in minutes and seconds
    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;
    if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
    if (durationMinutes < 10) durationMinutes = "0" + durationMinutes;

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    totalDurationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

// Seek to position
function seekTo() {
  const seekTo = audio.duration * (seekSlider.value / 100);
  audio.currentTime = seekTo;
}

// Change volume
function setVolume() {
  audio.volume = volumeSlider.value / 100;
}

// Build playlist UI
function buildPlaylist() {
  tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.textContent = `${track.name} - ${track.artist}`;
    li.addEventListener("click", () => {
      trackIndex = i;
      loadTrack(trackIndex);
      playTrack();
    });
    playlistEl.appendChild(li);
  });
}

// Highlight current playing song in playlist
function highlightPlaylistItem() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === trackIndex);
  });
}

// Autoplay next song when current ends
audio.addEventListener("ended", nextTrack);

// Event listeners
playPauseBtn.addEventListener("click", playPauseTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
seekSlider.addEventListener("input", seekTo);
volumeSlider.addEventListener("input", setVolume);

// Initialize
buildPlaylist();
loadTrack(trackIndex);
