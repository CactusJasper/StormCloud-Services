$(() => {
    let socket = io();
    let confDeleteModel = $('#confDeleteModal');
    let confDeleteTrigger = $('.conf-delete-trigger');
    let closeBtn = $('.close');

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    confDeleteTrigger.on('click', (event) => {
        event.preventDefault();
        let id = $(event.target)[0].dataset.roleid;
        console.log($(event.target)[0]);
        $('#delete-reward-text').text(`Are you sure you want to delete the mod role of ${$('#role-name-' + id).text()}`);
        $('#role-delete-conf')[0].dataset.roleid = id;
        confDeleteModel.css('display', 'block');
    });

    $('#role-delete-conf').click((event) => {
        let id = $(event.target)[0].dataset.roleid;
        
    });

    closeBtn.on('click', (event) => {
        event.preventDefault();
        confDeleteModel.css('display', 'none');
    });

    $('.close-btn').on('click', (event) => {
        event.preventDefault();
        confDeleteModel.css('display', 'none');
    });
});