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
    if (msg['logged in'] === false) {
    } else {
        if (msg.data == null) {
            $('#track-title').html("The silence...");
            $('#track-artist').html("I could get used to it");
        } else {
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
                document.getElementById("global-background").style.backgroundImage = "url(" + cover + ")";
                document.getElementById("album-cover").src = cover;
            }
        }
    }
});

socket.on('transaction', function(msg) {
    queueMarquee(msg.message);
});

socket.on('slide_data', function(msg) {
    //console.log("Recv slide data for " + msg.name);
    slides[msg.name].data = msg.data
});

socket.on('slide_interrupt', function(msg) {
    msg = msg.message;
    //console.log("Recei interrupt for " + msg.name);
    slides[msg.name].data = msg.data;
    interruptCarousel(slides[msg.name])
});

socket.on('stats', function(msg) {
    console.log("Received stats update");
    console.log(msg);
    updateDailyStats(msg.daily, msg.max);
});

function updateSlideData(name) {
    //console.log("send slide data for " + name);
    socket.emit('slide_data', {"name": name})
}

function spotify_update() {
    socket.emit('spotify');
    var t = setTimeout(spotify_update, 5000);
}