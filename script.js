const sounds = {
    laugh: 'laugh.mp3',
    car: 'V12.mp3',
    bike: 'bike.mp3',
    weight: 'weight.mp3'
};

const buttons = document.querySelectorAll('.sound-btn');
const volumeControl = document.getElementById('volume');
const muteBtn = document.getElementById('mute');
const playPauseBtn = document.getElementById('playPause');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeDisplay = document.querySelector('.time-display');

let muted = false;
let currentVolume = parseFloat(volumeControl.value);
let audio = new Audio();

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function resetProgress() {
    progressFill.style.width = '0%';
    timeDisplay.textContent = '00:00 / 00:00';
    playPauseBtn.textContent = 'Play';
}

// BUTTONS PLAY AUTOMATICALLY ON CLICK
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const soundName = button.getAttribute('data-sound');
        if (sounds[soundName]) {
            // Stop current audio and load new one
            audio.pause();
            audio.currentTime = 0;
            audio.src = sounds[soundName];
            audio.volume = muted ? 0 : currentVolume;
            audio.load();
            resetProgress();

            // Play automatically
            audio.play().then(() => {
                playPauseBtn.textContent = 'Pause';
            }).catch(e => {
                console.error('Auto-play failed:', e);
            });
        }
    });
});

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (!audio.src) return;

    if (audio.paused) {
        audio.play().then(() => {
            playPauseBtn.textContent = 'Pause';
        });
    } else {
        audio.pause();
        playPauseBtn.textContent = 'Play';
    }
});

// Progress updates
audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`;
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
});

audio.addEventListener('ended', () => {
    progressFill.style.width = '100%';
    timeDisplay.textContent = `${formatTime(audio.duration)} / ${formatTime(audio.duration)}`;
    playPauseBtn.textContent = 'Play';
});

// Seek on progress bar click
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (!isNaN(audio.duration) && audio.duration > 0) {
        const seekTime = (clickX / width) * audio.duration;
        audio.currentTime = seekTime;
    }
});

// Volume control
volumeControl.addEventListener('input', () => {
    currentVolume = parseFloat(volumeControl.value);
    if (!muted) {
        audio.volume = currentVolume;
    }
    if (muted && currentVolume > 0) {
        muted = false;
        muteBtn.textContent = 'Mute';
    }
});

// Mute button
muteBtn.addEventListener('click', () => {
    muted = !muted;
    if (muted) {
        audio.volume = 0;
        muteBtn.textContent = 'Unmute';
    } else {
        audio.volume = currentVolume;
        muteBtn.textContent = 'Mute';
    }
});