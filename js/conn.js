var tikkerUrl = "http://127.0.0.1:5000";
var socket = io(tikkerUrl + "/bigscreen");
var spotifyRefreshTime = 5000;  // ms

let currentSpotifyTrack = "";
let currentSpotifyTrackProgress = 1;
let currentSpotifyTrackEnd = new Date();
let currentSpotifyTrackLength = 1;
let currentSpotifyTrackPlaying = false;

let errorTimeout;
let connected = false;
let connectedOnce = false;
let loading = true;

let backgroundFire = false;
let backgroundVideoClip = false;

socket.on('connect', function() {
    connected = true;
    setTikkerOnline();
    console.log('Connected to Tikker!');

    if (loading) {
        if (connectedOnce) {
            location.reload();
        } else {
            clearTimeout(errorTimeout);
            let error = document.getElementById('loading-error');
            error.style.visibility = "hidden";
            error.innerHTML = `<i>Weet je zeker dat Tikker geen foutmeldingen laat zien in de console?</i>`;
            errorTimeout = setTimeout(showError, 5000);
            connectedOnce = true;
        }
    }
});

socket.on('disconnect', function() {
    connected = false;
    setTikkerOffline();
    console.log('Connection with Tikker lost')
});

socket.on('my response', function(msg) {
    $('#contentblock').append('<p>Received: ' + msg.data + '</p>');
});

socket.on('spotify update', function(msg) {
    updateSpotify(msg);
});

function updateSpotify(msg) {
    const defaultTitle = "";
    const defaultArtist = "";
    const defaultPodcastTitle = `Een podcast, maar geen idee welke ¯\\_(ツ)_/¯`;
    const defaultPodcastArtist = "Ik hoop een escalatiemix van Gebroeders Scooter?";

    if (msg['logged in'] === true && msg.data !== null) {
        document.getElementById('spotify-user').innerHTML = msg['user'];
        document.getElementById('spotify-logo').style.visibility = "visible";
        currentSpotifyTrackProgress = msg.data['progress_ms'];

        if (backgroundVideoClip && currentSpotifyTrackPlaying && !msg.data['is_playing']) {
            pauseVideoClipBackground(true);
        } else if (backgroundVideoClip && !currentSpotifyTrackPlaying && msg.data['is_playing']) {
            pauseVideoClipBackground(false);
        }

        currentSpotifyTrackPlaying = msg.data['is_playing'];

        if (msg.data['currently_playing_type'] === "track") {
            currentSpotifyTrackEnd = new Date();
            currentSpotifyTrackEnd = new Date(currentSpotifyTrackEnd.getTime() + msg.data.item['duration_ms'] - msg.data['progress_ms']);

            if (currentSpotifyTrack !== msg.data.item.id) {
                if (!msg.data.video && backgroundVideoClip) {
                    hideVideoClipBackground()
                } else if (msg.data.video && !backgroundFire) {
                    openVideoClipBackground(tikkerUrl + "/static/videos/" + msg.data.item.id + ".mp4");
                }

                currentSpotifyTrack = msg.data.item.id;
                currentSpotifyTrackLength = msg.data.item['duration_ms'];
                $('#track-title').html(msg.data.item.name);
                let trackArtists = "";
                for (let i = 0; i < msg.data.item.artists.length; i++) {
                    trackArtists = trackArtists + msg.data.item.artists[i].name + ", "
                }
                $('#track-artist').html(trackArtists.substring(0, trackArtists.length - 2));

                let cover = tikkerUrl + "/static/covers/" + msg.data.item.album.id + ".jpg";

                updateCover(cover);
            }

        } else if (msg.data['currently_playing_type'] === "episode") {
            if (currentSpotifyTrack !== msg.data['currently_playing_type']) {
                currentSpotifyTrack = msg.data['currently_playing_type'];
                updateCover("img/podcast.jpg", "img/default-background.png")
            }
            currentSpotifyTrackEnd = new Date();
            currentSpotifyTrackEnd = new Date(currentSpotifyTrackEnd.getTime() + spotifyRefreshTime);
            currentSpotifyTrackLength = msg.data['progress_ms'] + spotifyRefreshTime;
            $('#track-title').html(defaultPodcastTitle);
            $('#track-artist').html(defaultPodcastArtist);

            if (backgroundVideoClip) {
                hideVideoClipBackground()
            }
        }

    } else {
        document.getElementById('spotify-logo').style.visibility = "hidden";
        $('#track-title').html(defaultTitle);
        $('#track-artist').html(defaultArtist);

        if (backgroundVideoClip) {
            hideVideoClipBackground()
        }
    }
}

socket.on('transaction', function(msg) {
    queueMarquee(msg.message);
});

socket.on('slide_data', function(msg) {
    console.log(msg);
    slides[msg.name].data = msg.data
});

socket.on('slide_interrupt', function(msg) {
    msg = msg.message;
    slides[msg.name].data = msg.data;
    interruptCarousel(slides[msg.name])
});

socket.on('init', function(msg) {
    console.log(msg);
    console.log("received init response");
    clearTimeout(errorTimeout);
    if (msg.snow === false) {
        snowStorm.stop();
    }
    slides[msg.slide.name].data = msg.slide.data;
    updateSpotify(msg.spotify);
    updateDailyStats(msg.stats.daily, msg.stats.max);
    runCarouselObj();
    spotify_send_update();
    spotifyprogress();

    let name;
    let slideNames = Object.keys(slides);
    // Loop over all slides and send a request for their current data
    for (let i = 0; i < slideNames.length; i++) {
        name = slides[slideNames[i]].constructor.name;
        updateSlideData(name);
    }

    setTimeout(hideLoading, 1500);
    loading = false;
    console.log("finished initialization")
});

socket.on('stats', function(msg) {
    updateDailyStats(msg.daily, msg.max);
});

socket.on('snow', function() {
    snowStorm.stop();
});

socket.on('fireplace', function () {
    let video = document.getElementById('background-video');
    let background = document.getElementById('background-video-background');
    if (!backgroundFire) {
        if (backgroundVideoClip) {
            hideVideoClipBackground();
        }
        video.play();
        video.style.opacity = '1';
        background.style.opacity = '1';
        backgroundFire = true;
    } else {
        video.pause();
        video.style.opacity = '0';
        background.style.opacity = '0';
        backgroundFire = false;
    }
});

socket.on('reload', function() {
    location.reload();
});

socket.on('biertje_kwartiertje_start', function(msg) {
    console.log("Start biertje kwartiertje");
    startBK(msg.minutes * 60 * 1000);
});

socket.on('biertje_kwartiertje_stop', function() {
    console.log("Stop biertje kwartiertje");
    bkStarted = false;
});

function initFromTikker(slideName) {
    console.log("send init request");
    socket.emit('init', {"slide_name": slideName, "slide_time": slideTime / 1000});
    errorTimeout = setTimeout(showError, 5000);
}

function updateSlideData(name) {
    socket.emit('slide_data', {"name": name})
}

function spotify_send_update() {
    socket.emit('spotify');
    var t = setTimeout(spotify_send_update, spotifyRefreshTime);
}

function biertje_kwartiertje_exec() {
    socket.emit('biertje_kwartiertje_exec');
}

function showError() {
    document.getElementById('loading-error').style.visibility = "visible";

}

function setTikkerOffline() {
    let circle = document.getElementById('status-dot');
    let status_text = document.getElementById('status-text');
    circle.style.backgroundColor = 'red';
    circle.classList.remove("pulsation");
    status_text.style.color = 'red';
    status_text.innerHTML = "Tikker offline";
}

function setTikkerOnline() {
    let circle = document.getElementById('status-dot');
    let status_text = document.getElementById('status-text');
    circle.style.backgroundColor = 'green';
    circle.classList.add("pulsation");
    status_text.style.color = 'green';
    status_text.innerHTML = "Tikker online";
}
