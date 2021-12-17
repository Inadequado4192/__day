

function init() {
    (document.querySelector("#secure") as HTMLElement).remove();

    const timetable = document.querySelector("#timetable") as HTMLElement;
    for (let i = 0; i <= 24; i++) {
        timetable.insertAdjacentHTML("beforeend", `
    <div data-time="${i}">
        <span class="time">${i < 10 ? `0${i}` : i}:00</span>
        <div class="tasks">${TIMETABLE[i as keyof typeof TIMETABLE].map((t: string) => `<span>${t}</span>`)}</div>
    </div>
        `);
    }

    // const elems = document.querySelector<HTMLElement>("#timetable > div");


    let start = new Date().getHours();
    (() => {
        let tasks: string[] = [];
        let tmp = start;
        while (tmp >= 0) {
            TIMETABLE[tmp as keyof typeof TIMETABLE].forEach((s: string) => tasks.push(s));
            tmp--;
        }
        tasks.length > 0 && sendNotification(tasks);
    })();

    (function loop() {
        let now = new Date().getHours();
        let _old = document.querySelector<HTMLElement>(`#timetable > div.now`);
        let _new = document.querySelector<HTMLElement>(`#timetable > div[data-time=\"${now}\"]`) as HTMLElement;

        if (_old !== _new) {
            _old?.classList.remove("now")

            _new.classList.add("now");
            // _new?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy({
                top: _new.offsetTop - innerHeight / 4 - window.scrollY,
                behavior: "smooth"
            });
            let tasks = TIMETABLE[now as keyof typeof TIMETABLE];
            tasks.length > 0 && now !== start && sendNotification(tasks);
        }

        setTimeout(loop, 1000);
    })();
}

document.onkeydown = e => e.ctrlKey == true && e.shiftKey == true && init();






function sendNotification(tasks: readonly string[] | string[]) {//title: string, options?: NotificationOptions | undefined) {
    const options: NotificationOptions = {
        lang: "RU",
        body: tasks.map((s: string) => "• " + s).join("\n"),
        icon: "https://cdn-icons-png.flaticon.com/512/1061/1061447.png",
        requireInteraction: true
    }

    if (Notification.permission === "granted") new Notification("Timetable", options);
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(permission => {
            if (permission === "granted") new Notification("Timetable", options);
        });
    }
}