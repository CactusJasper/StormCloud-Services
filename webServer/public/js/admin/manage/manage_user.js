window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let userId = uid;
    document.getElementById('toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });
});