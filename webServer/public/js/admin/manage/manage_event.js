window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let eventId = eid;
    document.getElementById('toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    document.getElementById('approve-btn').addEventListener('click', (event) => {
        socket.emit('approveEvent', {
            eventId: eventId
        });
    });

    document.getElementById('disapprove-btn').addEventListener('click', (event) => {
        socket.emit('disapproveEvent', {
            eventId: eventId
        });
    });

    socket.on('approveEventCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                window.location = '/planner'
            }
            else if(res.message == 'No Event')
            {
                window.location = '/admin/manage/events';
            }
            else
            {
                document.getElementById('error').innerHTML = '<p class="center error">Something went wrong please try again later.</p>'
            }
        }
        else if(res.status == 200)
        {
            document.getElementById('status').innerText = 'Aproval Status: Approved';
            document.getElementById('dummy-seperator').remove();
            document.getElementById('actions').remove();
        }
    });

    socket.on('disapproveEventCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                window.location = '/planner'
            }
            else
            {
                document.getElementById('error').innerHTML = '<p class="center error">Something went wrong please try again later.</p>'
            }
        }
        else if(res.status == 200)
        {
            window.location = '/admin/manage/events';
        }
    });
});