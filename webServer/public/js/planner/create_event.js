$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    $('#eventDesc').on('input', (event) => {
        let char = $('#eventDesc').val().length;
        rem = 500 - char;
        if(rem <= 0)
        {
            $('#eventDesc').val($("#eventDesc").val().slice(0, 500));
            return $("#eventDesc-char-count").text("You have 0 characters left.");
        }
        $("#eventDesc-char-count").text("You have " + rem + " characters left.");
    });
});