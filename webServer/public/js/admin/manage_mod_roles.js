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

    socket.on('createModRoleCb', (res) => {
        if(res.status == 500)
        {
            $('#role-create-error').text('Something went wrong please try again later');
        }
        else if(res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                window.history.back();
            }
            else
            {
                $('#role-create-error').text(res.message);
            }
        }
        else if(res.status == 200)
        {
            window.location.reload();
        }
    });

    socket.on('deleteModRoleCb', (res) => {
        if(res.status == 200)
        {
            $(`#mod-role-${res.roleId}`).remove();
            confDeleteModel.css('display', 'none');
        }
        else if(res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                window.history.back();
            }
        }
    });

    $('#create-mod-role').click((event) => {
        event.preventDefault();
        let roleId = $('#role_selection').val();

        socket.emit('createModRole', {
            modLevel: $('#mod_level').val(),
            roleId: roleId
        });
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
        socket.emit('deleteModRole', {
            roleId: id
        });
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