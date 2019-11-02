var tikkerUrl = "http://127.0.0.1:5000"

function startFunctions() {
    startTime();
    pingTikker();
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    if (s % 2 == 0) {
        document.getElementById('clock').innerHTML = h + ":" + m;
    } else {
        document.getElementById('clock').innerHTML = h + " " + m;
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