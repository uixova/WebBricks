const launchBtn = document.getElementById("launch");
const fadeLayer = document.getElementById("fadeLayer");
const radar = document.getElementById("radarScreen");
const dotContainer = document.getElementById("dot-container");
const panel = document.getElementById("resultPanel");

// Sesler
const crashSound = new Audio("crash.mp3");
const bombFalling = new Audio("bomb-falling.mp3");
const bombExplosion = new Audio("bomb-explosion.mp3");
const radarSpinSound = new Audio("radar-spin.mp3"); // radar dönerken çalacak

radarSpinSound.loop = true; // döngüsel çalması için

launchBtn.onclick = () => {
    if (launchBtn.classList.contains("active")) return;
    launchBtn.classList.add("active");

    document.body.style.background = "linear-gradient(90deg, #300, #700, #300)";
    document.body.style.animation = "bgMove 4s linear infinite alternate";

    setTimeout(() => {
        crashSound.currentTime = 0;
        crashSound.play();

        launchBtn.style.opacity = "0";
        launchBtn.style.transform = "scale(0.5)";

        setTimeout(() => {
            launchBtn.style.display = "none";
            fadeLayer.style.opacity = "1";

            setTimeout(() => {
                radar.style.display = "block";
                radar.classList.add("radarAppear");
                fadeLayer.style.opacity = "0";

                // geri sayım
                const countdown = document.createElement("div");
                countdown.id = "countdown";
                countdown.style.position = "absolute";
                countdown.style.top = "50%";
                countdown.style.left = "50%";
                countdown.style.transform = "translate(-50%, -50%)";
                countdown.style.fontSize = "100px";
                countdown.style.color = "yellow";
                countdown.style.fontWeight = "bold";
                document.body.appendChild(countdown);

                let timeLeft = 10;
                countdown.textContent = timeLeft;

                // spam noktalar
                const tempDots = [];
                const spamInterval = setInterval(() => {
                    const dot = document.createElement("div");
                    dot.classList.add("dot");
                    dot.style.left = `${Math.random() * 90 + 5}%`;
                    dot.style.top = `${Math.random() * 90 + 5}%`;
                    dotContainer.appendChild(dot);
                    dot.classList.add("visible");
                    dot.style.animation = "blinkScale 1.5s infinite alternate";
                    tempDots.push(dot);
                    setTimeout(() => dot.remove(), 1000);
                }, 400);

                // radar-spin başlat
                radarSpinSound.currentTime = 0;
                radarSpinSound.play();

                const interval = setInterval(() => {
                    timeLeft--;
                    countdown.textContent = timeLeft;

                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        clearInterval(spamInterval);
                        countdown.remove();
                        tempDots.forEach(d => d.remove());

                        // noktayı spawn et
                        spawnDot();
                    }
                }, 1000);

            }, 900);

        }, 300);

    }, 2000);
};

function spawnDot() {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    const min = 40, max = 90;
    dot.style.left = `${Math.random() * (max - min) + min}%`;
    dot.style.top = `${Math.random() * (max - min) + min}%`;
    dotContainer.appendChild(dot);

    bombFalling.currentTime = 0;
    bombFalling.play();

    setTimeout(() => dot.classList.add("visible"), 100);

    setTimeout(() => {
        dot.classList.remove("visible");
        bombFalling.pause();

        // bomb patlayınca radar-spin duracak
        bombExplosion.currentTime = 0;
        bombExplosion.play();

        radarSpinSound.pause();
        radarSpinSound.currentTime = 0;

    }, 7500);

    setTimeout(() => {
        radar.style.transform = "scale(0.4)";
        radar.style.opacity = "0";

        setTimeout(() => {
            radar.style.display = "none";
            panel.style.opacity = "1";
            panel.style.transform = "translate(-50%, -50%)";
        }, 1000);

    }, 7600);
}
