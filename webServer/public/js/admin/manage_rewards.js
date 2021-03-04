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

    $('#create-role-reward').click((event) => {
        event.preventDefault();
        let level = $('#level').val();
        let role = $('#role_selection').val();

        $('#role-create-error').text('');
        if(level < 1)
        {
            $('#role-create-error').text('Please Provide a unlock level of at least 1');
        }
        else
        {
            if(role == null || role == undefined)
            {
                $('#role-create-error').text('Please select a role to be rewarded');
            }
            else
            {
                socket.emit('createReward', {
                    level: level
                });
            }
        }
    });

    confDeleteTrigger.on('click', (event) => {
        event.preventDefault();
        let id = $(event.target)[0].dataset.roleid;
        $('#delete-reward-text').text(`Are you sure you want to delete the reward of ${$('#role-name-' + id).text()}`);
        confDeleteModel.css('display', 'block');
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