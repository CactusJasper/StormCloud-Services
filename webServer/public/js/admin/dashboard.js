$(() => {
    let socket = io();
    let duid = userId;
    let su = superUser;
    $('#toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {
            user_id: duid
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {
                user_id: duid
            });
        }, (60 * 1000) * 10);
    });
});