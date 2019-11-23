var tikkerUrl = "http://127.0.0.1:5000";
var socket = io(tikkerUrl + "/test");

let currentSpotifyTrack = "";
let currentSpotifyTrackProgress = 1;
let currentSpotifyTrackEnd = new Date();
let currentSpotifyTrackLength = 1;
let currentSpotifyTrackPlaying = false;

socket.on('my response', function(msg) {
    $('#contentblock').append('<p>Received: ' + msg.data + '</p>');
});

socket.on('spotify update', function(msg) {
    updateSpotify(msg);
});

function updateSpotify(msg) {
    const defaultTitle = "";
    const defaultArtist = "";
    if (msg['logged in'] === true && msg.data !== null) {
        document.getElementById('spotify-user').innerHTML = msg['user'];
        currentSpotifyTrackEnd = new Date();
        currentSpotifyTrackEnd = new Date(currentSpotifyTrackEnd.getTime() + msg.data.item['duration_ms'] - msg.data['progress_ms']);
        currentSpotifyTrackPlaying = msg.data['is_playing'];
        currentSpotifyTrackProgress = msg.data['progress_ms'];
        if (currentSpotifyTrack !== msg.data.item.id) {
            currentSpotifyTrack = msg.data.item.id;
            currentSpotifyTrackLength = msg.data.item['duration_ms'];
            $('#track-title').html(msg.data.item.name);
            let trackArtists = "";
            for (let i = 0; i < msg.data.item.artists.length; i++) {
                trackArtists = trackArtists + msg.data.item.artists[i].name + ", "
            }
            $('#track-artist').html(trackArtists.substring(0, trackArtists.length - 2));

            let cover = tikkerUrl + "/static/covers/" + msg.data.item.album.id + ".jpg";
            /*document.getElementById("global-background-top").style.backgroundImage = "url(" + cover + ")";
            document.getElementById("album-cover-top").src = cover;*/
            updateCover(cover);
        }
    } else {
        $('#track-title').html(defaultTitle);
        $('#track-artist').html(defaultArtist);
    }
}

socket.on('transaction', function(msg) {
    queueMarquee(msg.message);
});

socket.on('slide_data', function(msg) {
    if (msg.name === 'Quote') {
        console.log(msg)
    }
    slides[msg.name].data = msg.data
});

socket.on('slide_interrupt', function(msg) {
    msg = msg.message;
    slides[msg.name].data = msg.data;
    interruptCarousel(slides[msg.name])
});

socket.on('init', function(msg) {
    console.log("received init response");
    console.log(msg);
    slides[msg.slide.name].data = msg.slide.data;
    updateSpotify(msg.spotify);
    updateDailyStats(msg.stats.daily, msg.stats.max);
    runCarouselObj();
    spotify_send_update();
    spotifyprogress();
    setTimeout(hideLoading, 1500);
});

socket.on('stats', function(msg) {
    updateDailyStats(msg.daily, msg.max);
});

function initFromTikker(slideName) {
    console.log("send init request");
    socket.emit('init', {"slide_name": slideName})
}

function updateSlideData(name) {
    socket.emit('slide_data', {"name": name})
}

function spotify_send_update() {
    socket.emit('spotify');
    var t = setTimeout(spotify_send_update, 5000);
}