
function startFunctions() {
    startTime();
    pingTikker();
    spotify_update();
    spotifyprogress();
    //startMarquee();
    startCarousel();
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    if (s % 2 === 0) {
        document.getElementById('clock-hour').innerHTML = h;
        document.getElementById('clock-middle').innerHTML = ":";
        document.getElementById('clock-minute').innerHTML = m;
    } else {
        document.getElementById('clock-hour').innerHTML = h;
        document.getElementById('clock-middle').innerHTML = "";
        document.getElementById('clock-minute').innerHTML = m;
    }
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) { // add zero in front of numbers < 10
        i = "0" + i
    }
    return i;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var alreadyoffline = false;

function pingTikker() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', tikkerUrl + '/api/ping', true);
    xhr.timeout = 2000;
    xhr.setRequestHeader("Access-Control-Allow-Origin", tikkerUrl);
    var circle = document.getElementById('status-dot');
    var status_text = document.getElementById('status-text');

    xhr.onload = function() {
        circle.style.backgroundColor = 'green';
        circle.classList.add("pulsation");
        status_text.style.color = 'green';
        status_text.innerHTML = "Tikker online";
        if (alreadyoffline) {
            alreadyoffline = false;
            circle.style.backgroundColor = 'green';
            circle.classList.add("pulsation");
            status_text.style.color = 'green';
            status_text.innerHTML = "Tikker online";
        }
    };
    xhr.ontimeout = function(e) {
        if (!alreadyoffline) {
            alreadyoffline = true;
            circle.style.backgroundColor = 'red';
            circle.classList.remove("pulsation");
            status_text.style.color = 'red';
            status_text.innerHTML = "Tikker offline";
        }
    };

    xhr.send(null);
    var t = setTimeout(pingTikker, 15000);
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

let recordedSpotifyTrackEnd = Date();

function spotifyprogress() {
    if (currentSpotifyTrackPlaying) {
        let now = new Date();
        let pdiff = currentSpotifyTrackEnd - now;
        if (pdiff < 0) {
            pdiff = 0
        }

        let tdiff = recordedSpotifyTrackEnd - now;

        let currentSpotifyTrackProgressCalced = currentSpotifyTrackLength - pdiff;
        let perc = 100 - Math.round(pdiff * 10000 / currentSpotifyTrackLength) / 100;

        document.getElementById("track-current-time").innerHTML = millisToMinutesAndSeconds(currentSpotifyTrackProgressCalced);
        document.getElementById("track-progress-bar-inner").style.width = perc + "%";

        if (pdiff > 500) {
            recordedSpotifyTrackEnd = currentSpotifyTrackEnd;
            let progessbar = document.getElementById("track-progress-bar-inner");
            progessbar.style.animation = "";
            progessbar.style.animationTimingFunction = "";
            progessbar.style.animationDelay = "";

            progessbar.style.animation = "track-progress-bar-anim "+ currentSpotifyTrackLength +"ms;";
            progessbar.style.animationTimingFunction = "linear";
            progessbar.style.animationDelay = "-" + currentSpotifyTrackProgressCalced + "ms";
        }

        document.getElementById("track-end-time").innerHTML = millisToMinutesAndSeconds(currentSpotifyTrackLength);
    } else {
        document.getElementById("track-current-time").innerHTML = millisToMinutesAndSeconds(currentSpotifyTrackProgress);
        document.getElementById("track-end-time").innerHTML = millisToMinutesAndSeconds(currentSpotifyTrackLength);
        let perc = Math.round(currentSpotifyTrackProgress * 10000 / currentSpotifyTrackLength) / 100;
        document.getElementById("track-progress-bar-inner").style.width = perc + "%";
    }
    var t = setTimeout(spotifyprogress, 100);
}

(function($) {
    $.fn.textWidth = function(){
        /*var text = $(this).text();
        var makeuptext = "This is a test for the marquee";
        var calc = '<span style="display:none">' + makeuptext + '</span>';
        $('.measure-text-width').append(calc);
        var width = $('.measure-text-width').find('span:last').width();
        $('.measure-text-width').find('span:last').remove();
        console.log("width: " + width);
        return width;*/
        var calc = '<span class="marq" style="display:none">' + $(this).text() + '</span>';
        $('body').append(calc);
        var width = $('body').find('span:last').width();
        $('body').find('span:last').remove();
        return width;
    };

    $.fn.marquee = function(args) {
        var that = $(this);
        var textWidth = that.textWidth(),
            offset = that.width(),
            width = offset,
            css = {
                'text-indent' : that.css('text-indent'),
                'overflow' : that.css('overflow'),
                'white-space' : that.css('white-space')
            },
            marqueeCss = {
                'text-indent' : width,
                'overflow' : 'hidden',
                'white-space' : 'nowrap'
            },
            args = $.extend(true, { count: -1, speed: 1e1, leftToRight: false }, args),
            i = 0,
            stop = textWidth*-1,
            dfd = $.Deferred();

        function go() {
            if(!that.length) return dfd.reject();
            if(width <= stop) {
                i++;
                if(i === args.count) {
                    that.css(css);
                    return dfd.resolve();
                }
                if(args.leftToRight) {
                    width = textWidth*-1;
                } else {
                    width = offset;
                }
            }
            that.css('text-indent', width + 'px');
            if(args.leftToRight) {
                width++;
            } else {
                width--;
            }
            setTimeout(go, args.speed);
        };
        if(args.leftToRight) {
            width = textWidth*-1;
            width++;
            stop = offset;
        } else {
            width--;
        }
        that.css(marqueeCss);
        go();
        return dfd.promise();
    };
})(jQuery);

function startMarquee() {
    $('.marq').marquee({ count: 1, speed: 2 }).done(function() { $('h5').css('color', '#f00'); })
}

let queue = [];
let marqueeWorking = false;

function queueMarquee(message) {
    queue.push(message);
    if (marqueeWorking === false) {
        popQueueMarquee()
    }
}

let string = "";

function testMarquee() {
    //document.getElementById("marquee").innerHTML = `<p class='marq'>1x Bier voor Roy, Reindert, Hans, Bart</p>`;
    //$('.marq').marquee({ count: 1, speed: 1 }).done(function() { document.getElementById("marquee").innerHTML = "" })
    queueMarquee("Biertje erbij? " + string);
    string = string + "aaaaaa"
}

function popQueueMarquee() {
    marqueeWorking = true;
    let message = queue.shift();
    document.getElementById("marquee").innerHTML = `<p class='marq'>${message}</p>`;
    $('.marq').marquee({ count: 1, speed: 1 }).done(function() {
        document.getElementById("marquee").innerHTML = "";
        if (queue.length > 0) {
            popQueueMarquee()
        } else {
            marqueeWorking = false;
        }
    });
}

function updateDailyStats(daily, max) {
    let table = document.getElementById('stats-table');
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const id = row.id.substring(10, row.id.length);
        //console.log("done")
        row.cells[1].innerHTML = daily[id];
        row.cells[2].innerHTML = max["max-stats-" + id];
    }
}
