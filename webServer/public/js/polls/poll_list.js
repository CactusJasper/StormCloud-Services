$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getPollList', {
            pollId: pid
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getPollList', {
                pollId: pid
            })
        }, (60 * 1000) * 5);
    });

    socket.on('getPollListCb', (res) => {

    });

    socket.on('pollListData', (res) => {

    });
});