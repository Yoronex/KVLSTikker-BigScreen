let bkInterval;
let bkEndTime;
let bkStarted = false;

function startFunctions() {
    updateClocks();
    initFromTikker(
        initCarousel()
    );
}

function updateClocks() {
    var t = setTimeout(updateClocks, 500);
    startTime();
    updateBK();
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
}

// Start Biertje Kwartiertje if it is not started yet
function startBK(interval) {
    // Interval must be in milliseconds
    bkInterval = interval;
    bkEndTime = new Date(new Date().getTime() + interval);
    bkStarted = true;
}

function updateBK() {
    // Default times if bk not enabled
    let s = "--";
    let m = "--";
    let bkMinute = document.getElementById("bk-minute");
    let bkMiddle = document.getElementById("bk-middle");
    let bkSecond = document.getElementById("bk-second");
    // If bk is enabled, we change s and m
    if (bkStarted) {
        // Calculate difference between now and end in milliseconds
        let diff = bkEndTime - new Date();
        // If the difference is negative, the endtime has passed so we calculate the new one
        if (diff < 0) {
            bkEndTime = new Date(new Date().getTime() + bkInterval);
            diff = bkEndTime - new Date();
            // Send a message to Tikker to create transactions for all participants
            biertje_kwartiertje_exec();
        }
        // Convert milliseconds into seconds and minutes
        let seconds = parseInt(diff / 1000) % 60;
        let minutes = parseInt(diff / 60000);
        // Transform to a string of two symbols
        s = checkTime(seconds);
        m = checkTime(minutes);
        if (diff < 20000 && parseInt(diff / 500) % 2 === 1) {
            bkMinute.style.color = "red";
            bkSecond.style.color = "red";
            bkMiddle.style.color = "red";
            bkMinute.style.textShadow = "0 0 1px darkred";
            bkSecond.style.textShadow = "0 0 1px darkred";
            bkMiddle.style.textShadow = "0 0 1px darkred";
        } else {
            bkMinute.style.color = "white";
            bkSecond.style.color = "white";
            bkMiddle.style.color = "white";
            bkMinute.style.textShadow = "0 0 1px grey";
            bkSecond.style.textShadow = "0 0 1px grey";
            bkMiddle.style.textShadow = "0 0 1px grey";
        }
    }
    // Apply the calculated time
    bkMinute.innerHTML = m;
    bkSecond.innerHTML = s;
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

        if (backgroundVideoClip) {
            setVideoClipBackground(currentSpotifyTrackProgressCalced);
        }

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

let backgroundSwitch;
let busy = false;

function updateCover(cover, backgroundCover=null) {
    let front_background = document.getElementById('global-background-top');
    let back_background = document.getElementById('global-background-back');
    let front_cover = document.getElementById('album-cover-top');
    let back_cover = document.getElementById('album-cover-back');
    if (backgroundCover === null) {
        back_background.style.backgroundImage = "url(" + cover + ")";
    } else {
        back_background.style.backgroundImage = "url(" + backgroundCover + ")";
    }
    back_cover.src = cover;
    front_background.style.opacity = '0';
    front_cover.style.opacity = '0';
    backgroundSwitch = setTimeout(updateCoverPt2, 1000);
}

function updateCoverPt2() {
    let front_background = document.getElementById('global-background-top');
    let back_background = document.getElementById('global-background-back');
    let front_cover = document.getElementById('album-cover-top');
    let back_cover = document.getElementById('album-cover-back');
    front_background.style.backgroundImage = back_background.style.backgroundImage;
    front_cover.src = back_cover.src;
    front_background.style.opacity = '1';
    front_cover.style.opacity = '1';
    backgroundSwitch = null;
}

function openVideoClipBackground(source) {
    document.getElementById('background-video-source').src = source;
    document.getElementById('background-video').load();
    showVideoBackground();
    backgroundVideoClip = true;
}

function pauseVideoClipBackground(pause) {
    let video = document.getElementById('background-video');
    if (pause) {
        video.pause()
    } else {
        video.play()
    }
}

function setVideoClipBackground(milliseconds) {
    const seconds = milliseconds / 1000.0;
    console.log(seconds);
    let video = document.getElementById('background-video');
    if ((seconds < video.duration) && (Math.abs(video.currentTime - seconds) > 0.2)) {
        console.log('changed video time');
        video.currentTime = seconds;
    }
}

function hideVideoClipBackground() {
    hideVideoBackground();
    backgroundVideoClip = false;
    resetVideoBackground();
}

function resetVideoBackground() {
    document.getElementById('background-video-source').src = 'videos/fireplace.mp4';
    document.getElementById('background-video').load();
}

function showVideoBackground() {
    let video = document.getElementById('background-video');
    video.play();
    video.style.opacity = '1';
    document.getElementById('background-video-background').style.opacity = '1';
    document.getElementById('background-darken-filter').style.opacity = '0.2';
}

function hideVideoBackground() {
    let video = document.getElementById('background-video');
    video.pause();
    video.style.opacity = '0';
    document.getElementById('background-video-background').style.opacity = '0';
    document.getElementById('background-darken-filter').style.opacity = '0.5'
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

function hideLoading() {
    console.log("init finished, hide loading");
    document.getElementById('loading-screen').style.opacity = '0'
    setTimeout(hideLoadingInvis, 1000)
}

function hideLoadingInvis() {
    document.getElementById('loading-screen').style.visibility = 'hidden';
}

function initDrinkingScore() {
    const bar = document.getElementById('score-bar-inner');
    bar.style.transition = `top ${drinkingScoreRefreshTime / 1000}s`
}

function setDrinkingScore(percentage) {
    const bar = document.getElementById('score-bar-inner');
    bar.style.top = Math.max(100 - percentage, 0) + '%';
}
