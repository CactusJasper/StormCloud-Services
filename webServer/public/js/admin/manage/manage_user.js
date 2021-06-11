window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let userId = uid;
    document.getElementById('toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getUserData', {
            discordId: userId
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getUserData', {
                discordId: userId
            });
        }, 5000);
    });

    socket.on('getUserDataCb', (res) => {
        let levelDataEl = document.getElementById('level-data');
        if(res.status == 500)
        {
            levelDataEl.innerHTML = `<p class="error center">Unable to get Level Data</p>`;
        }
        else if(res.status == 900)
        {
            levelDataEl.innerHTML = `<p class="error center">Unable to get Level Data</p>`;
        }
        else if(res.status == 200)
        {
            let html = `<p class="center mb-3">XP Level: ${res.userData.level}</p>`;
            html += `<p class="center mb-3">Current XP: ${res.userData.xp}</p>`;
            html += `<p class="center mb-3">${getLevelToXP(res.userData.level + 1) - res.userData.xp} XP to go to Level ${res.userData.level + 1}</p>`;

            levelDataEl.innerHTML = html;
        }
    });
});