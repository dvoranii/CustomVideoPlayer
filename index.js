const video = document.getElementById("video");
const videoControls = document.getElementById("video-controls");

const playBtn = document.getElementById("play");
const playBackIcons = document.querySelectorAll(".playback-icons use");

const timeElapsed = document.getElementById("time-elapsed");
const duration = document.getElementById("duration");

const progressBar = document.getElementById("progress-bar");
const seek = document.getElementById("seek");
const seekTooltip = document.getElementById("seek-tooltip");

const playbackAnimation = document.getElementById("playback-animation");

const videoWorks = !!document.createElement("video").canPlayType;
if (videoWorks) {
  video.controls = false;
  videoControls.classList.remove("hidden");
}

function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

video.addEventListener("click", function () {
  togglePlay();
});

function updatePlayBtn() {
  playBackIcons.forEach((icon) => icon.classList.toggle("hidden"));

  if (video.paused) {
    playBtn.setAttribute("data-title", "Play (k)");
  } else {
    playBtn.setAttribute("data-title", "Pause (k)");
  }
}

playBtn.addEventListener("click", togglePlay);
video.addEventListener("play", updatePlayBtn);
video.addEventListener("pause", updatePlayBtn);

// look into this, possibly use non deprecated approach
// JS tutorial - dates
function formatTime(seconds) {
  const result = new Date(seconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute("max", videoDuration);
  progressBar.setAttribute("max", videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}
video.addEventListener("loadedmetadata", initializeVideo);

function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}
video.addEventListener("timeupdate", updateTimeElapsed);

function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}
video.addEventListener("timeupdate", updateProgress);

function updateSeekTooltip(e) {
  const skipTo = Math.round(
    (e.offsetX / e.target.clientWidth) *
      parseInt(e.target.getAttribute("max"), 10)
  );
  seek.setAttribute("data-seek", skipTo);
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${e.pageX - rect.left}px`;
}
seek.addEventListener("mousemove", updateSeekTooltip);

function skipAhead(e) {
  const skipTo = e.target.dataset.seek ? e.target.dataset.seek : e.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}
seek.addEventListener("input", skipAhead);

// may need to clear all values on page reload

// volume controls
const volumeButton = document.getElementById("volume-button");
const volumeIcons = document.querySelectorAll(".volume-button use");
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById("volume");

function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}

volume.addEventListener("input", updateVolume);

function updateVolumeIcon() {
  volumeIcons.forEach((icon) => {
    icon.classList.add("hidden");
  });

  volumeButton.setAttribute("data-title", "Mute (m)");

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove("hidden");
    volumeButton.setAttribute("data-title", "Unmute (m)");
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove("hidden");
  } else {
    volumeHigh.classList.remove("hidden");
  }
}

video.addEventListener("volumechange", updateVolumeIcon);

function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute("data-volume", volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}

volumeButton.addEventListener("click", toggleMute);

function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

video.addEventListener("click", animatePlayback);
