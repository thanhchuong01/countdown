// Set the date we're counting down to
var countDownDate = new Date("Feb 6, 2027 00:00:00").getTime();

function renderDigits(id, value, length) {
    var text = String(value);
    while (text.length < length) {
        text = "0" + text;
    }
    var el = document.getElementById(id);
    if (el.children.length !== length) {
        el.textContent = "";
        for (var i = 0; i < length; i++) {
            var digit = document.createElement("span");
            digit.className = "digit";
            el.appendChild(digit);
        }
    }
    for (var j = 0; j < length; j++) {
        var next = text.charAt(j);
        if (el.children[j].textContent !== next) {
            el.children[j].textContent = next;
        }
    }
}

var countdownFinished = false;
var fireworksStarted = false;

function finishCountdown() {
    if (countdownFinished) {
        return;
    }
    countdownFinished = true;
    clearInterval(x);
    var countdown = document.getElementById("countdown");
    countdown.classList.add("finished");
    countdown.innerHTML = "CHÚC MỪNG NĂM MỚI";
    startFireworks();
}

function startFireworks() {
    if (fireworksStarted) {
        return;
    }
    fireworksStarted = true;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    var canvas = document.getElementById("fireworks");
    var ctx = canvas.getContext("2d");
    var rockets = [];
    var sparks = [];
    var colors = ["#ffe7a3", "#f3d27a", "#fff8e4", "#ff5a3c", "#ffd24a", "#ffffff"];
    var lastLaunch = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function launch() {
        rockets.push({
            x: canvas.width * (0.12 + Math.random() * 0.76),
            y: canvas.height + 8,
            vx: (Math.random() - 0.5) * 1.4,
            vy: -(7 + Math.random() * 3.5),
            color: colors[Math.floor(Math.random() * colors.length)],
            target: canvas.height * (0.12 + Math.random() * 0.38)
        });
    }

    function explode(rocket) {
        var count = 48 + Math.floor(Math.random() * 28);
        for (var i = 0; i < count; i++) {
            var angle = (Math.PI * 2 * i) / count + Math.random() * 0.15;
            var speed = 1.4 + Math.random() * 3.4;
            sparks.push({
                x: rocket.x,
                y: rocket.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.01 + Math.random() * 0.014,
                color: Math.random() > 0.25 ? rocket.color : colors[Math.floor(Math.random() * colors.length)],
                size: 1.6 + Math.random() * 1.8
            });
        }
    }

    function frame(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (time - lastLaunch > 420) {
            launch();
            if (Math.random() > 0.45) {
                launch();
            }
            lastLaunch = time;
        }

        for (var i = rockets.length - 1; i >= 0; i--) {
            var rocket = rockets[i];
            rocket.x += rocket.vx;
            rocket.y += rocket.vy;
            rocket.vy += 0.045;
            ctx.beginPath();
            ctx.fillStyle = rocket.color;
            ctx.arc(rocket.x, rocket.y, 2.4, 0, Math.PI * 2);
            ctx.fill();
            if (rocket.vy >= -0.4 || rocket.y <= rocket.target) {
                explode(rocket);
                rockets.splice(i, 1);
            }
        }

        for (var j = sparks.length - 1; j >= 0; j--) {
            var spark = sparks[j];
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vy += 0.028;
            spark.vx *= 0.99;
            spark.life -= spark.decay;
            if (spark.life <= 0) {
                sparks.splice(j, 1);
                continue;
            }
            ctx.globalAlpha = Math.max(spark.life, 0);
            ctx.beginPath();
            ctx.fillStyle = spark.color;
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
}

function tick() {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    if (distance < 0) {
        finishCountdown();
        return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    renderDigits("days-num", days, 3);
    renderDigits("hours-num", hours, 2);
    renderDigits("minutes-num", minutes, 2);
    renderDigits("seconds-num", seconds, 2);
}

var x = setInterval(tick, 1000);
tick();

var soundButton = document.getElementById("sound-toggle");
var youtubePlayer = null;
var soundOn = false;
var youtubeFallbackUsed = false;

var youtubeScript = document.createElement("script");
youtubeScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeScript);

function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player("youtube-player", {
        videoId: "lQQcXpAjkJE",
        playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            listType: "playlist",
            list: "RDlQQcXpAjkJE"
        },
        events: {
            onReady: function (event) {
                event.target.mute();
                event.target.playVideo();
            },
            onError: function () {
                if (youtubeFallbackUsed || !youtubePlayer || typeof youtubePlayer.loadVideoById !== "function") {
                    return;
                }
                youtubeFallbackUsed = true;
                youtubePlayer.loadVideoById({
                    videoId: "lQQcXpAjkJE"
                });
                if (!soundOn) {
                    youtubePlayer.mute();
                }
            }
        }
    });
}

function setSoundButton(on) {
    soundOn = on;
    soundButton.classList.toggle("is-on", on);
    soundButton.setAttribute("aria-pressed", on ? "true" : "false");
    soundButton.setAttribute("aria-label", on ? "Tắt tiếng" : "Bật tiếng");
}

soundButton.addEventListener("click", function () {
    if (!youtubePlayer || typeof youtubePlayer.unMute !== "function") {
        return;
    }
    if (soundOn) {
        youtubePlayer.mute();
        setSoundButton(false);
        return;
    }
    youtubePlayer.unMute();
    youtubePlayer.playVideo();
    setSoundButton(true);
});