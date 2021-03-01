$(() => {
    let socket = io();
    let duid = userId;

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

    $('#q2').on('input', (event) => {
        let char = $('#q2').val().length;
        rem = 250 - char;
        if(rem <= 0)
        {
            $('#q2').val($("#q2").val().slice(0, 250));
            return $("#q2-char-count").text("You have 0 characters left.");
        }
        $("#q2-char-count").text("You have " + rem + " characters left.");
    });

    $('#q6').on('input', (event) => {
        let char = $('#q6').val().length;
        rem = 250 - char;
        if (rem <= 0) {
            $('#q6').val($("#q6").val().slice(0, 250));
            return $("#q6-char-count").text("You have 0 characters left.");
        }
        $("#q6-char-count").text("You have " + rem + " characters left.");
    });
    
    $('#q7').on('input', (event) => {
        let char = $('#q7').val().length;
        rem = 500 - char;
        if (rem <= 0) {
            $('#q7').val($("#q7").val().slice(0, 500));
            return $("#q7-char-count").text("You have 0 characters left.");
        }
        $("#q7-char-count").text("You have " + rem + " characters left.");
    });
});