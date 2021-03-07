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

    socket.on('createRoleRwardCb', (res) => {
        if(res.status == 500)
        {
            $('#role-create-error').text('Something went wrong please try again later.');
        }
        else if(res.status == 900)
        {
            if(res.message == 'Invalid level num')
            {
                $('#role-create-error').text('Please Provide a unlock level of at least 1.');
            }
            else if(res.message == 'Invalid Role Id')
            {
                $('#role-create-error').text('Please select a role to be rewarded.');
            }
            else if(res.message == 'Unauthorised')
            {
                window.history.back();
            }
        }
        else if(res.status == 200)
        {
            window.location.reload();
        }
    });

    socket.on('deleteRewardCb', (res) => {
        if(res.status == 200)
        {
            $(`#reward-${res.roleId}`).remove();
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

    $('#create-role-reward').click((event) => {
        event.preventDefault();
        let level = $('#level').val();
        let role = $('#role_selection').val();

        $('#role-create-error').text('');
        if(level < 1)
        {
            $('#role-create-error').text('Please Provide a unlock level of at least 1.');
        }
        else
        {
            
            if(role == null || role == undefined)
            {
                $('#role-create-error').text('Please select a role to be rewarded.');
            }
            else
            {
                socket.emit('createReward', {
                    level: level,
                    roleId: role
                });
            }
        }
    });

    confDeleteTrigger.on('click', (event) => {
        event.preventDefault();
        let id = $(event.target)[0].dataset.roleid;
        $('#delete-reward-text').text(`Are you sure you want to delete the reward of ${$('#role-name-' + id).text()}`);
        $('#reward-delete-conf')[0].dataset.roleid = id;
        confDeleteModel.css('display', 'block');
    });

    $('#reward-delete-conf').click((event) => {
        let id = $(event.target)[0].dataset.roleid;
        socket.emit('deleteReward', {
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