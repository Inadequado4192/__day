"use strict";
let _init = false;
function init() {
    localStorage.open = 1;
    _init = true;
    document.querySelector("#secure")?.remove();
    const timetable = document.querySelector("#timetable");
    for (let i = 0; i <= 24; i++) {
        timetable.insertAdjacentHTML("beforeend", `
    <div data-time="${i}">
        <span class="time">${i < 10 ? `0${i}` : i}:00</span>
        <div class="tasks">${TIMETABLE[i].map((t) => `<span>${t}</span>`).join("")}</div>
    </div>
        `);
    }
    let start = new Date().getHours();
    (() => {
        let tasks = [];
        let tmp = start;
        while (tmp >= 0) {
            TIMETABLE[tmp].forEach((s) => tasks.push(s));
            tmp--;
        }
        tasks.length > 0 && sendNotification(tasks);
    })();
    (function loop() {
        let now = new Date().getHours();
        let _old = document.querySelector(`#timetable > div.now`);
        let _new = document.querySelector(`#timetable > div[data-time=\"${now}\"]`);
        if (_old !== _new) {
            _old?.classList.remove("now");
            _new.classList.add("now");
            window.scrollBy({
                top: _new.offsetTop - innerHeight / 4 - window.scrollY,
                behavior: "smooth"
            });
            let tasks = TIMETABLE[now];
            tasks.length > 0 && now !== start && sendNotification(tasks);
        }
        setTimeout(loop, 1000);
    })();
}
+localStorage.open == 1 && init();
document.onkeydown = e => (e.ctrlKey == true && e.shiftKey == true && _init == false && init(), true);
function sendNotification(tasks) {
    const options = {
        lang: "RU",
        body: tasks.map((s) => "• " + s).join("\n"),
        icon: "https://cdn-icons-png.flaticon.com/512/1061/1061447.png",
        requireInteraction: true
    };
    if (Notification.permission === "granted")
        new Notification("Timetable", options);
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(permission => {
            if (permission === "granted")
                new Notification("Timetable", options);
        });
    }
}
