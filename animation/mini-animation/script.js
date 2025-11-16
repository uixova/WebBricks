let btn = document.getElementById("launchBtn");
let radar = document.getElementById("radar");
let target = document.querySelector(".target");
let sound = document.getElementById("alertSound");

btn.onclick = () => {
    radar.style.opacity = 1;

    setTimeout(() => {
        target.style.opacity = 1;
        target.style.transform = "scale(1)";
        sound.play();
    }, 1200);

    sound.onended = () => {
        target.style.opacity = 0;
        target.style.transform = "scale(0.4)";
    };
};
