$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getPollList', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getPollList', {})
        }, (60 * 1000) * 1);
    });

    socket.on('getPollListCb', (res) => {
        console.log(res);
    });
});