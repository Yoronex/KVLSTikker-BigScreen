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
    console.log("Received transaction!")
    queueMarquee(msg.message)
});

function initSocketIO() {


    //socket.on('connect', on_connect());
    socket.on('event', on_event());
}

function on_connect() {
    var content = document.getElementById('contentblock');
    content.innerHTML = "Connected to SocketIO!"
}

function on_event() {
    var content = document.getElementById('contentblock');
    content.innerHTML = ""
}

function spotify_update() {
    socket.emit('spotify');
    var t = setTimeout(spotify_update, 5000);
}