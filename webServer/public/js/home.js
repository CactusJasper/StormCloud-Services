$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        socket.emit('getApplications', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getApplications', {});
        }, (30 * 1000));
    });

    socket.on('updateApplications', (res) => {
        $('#applications-display').html('');

        if(res.status == 500)
        {
            $('#applications-display').append('<h3>Unable to get Application Data at this time.</h3>');
        }
        else if(res.status == 900)
        {
            if(res.message == 'No Applications')
            {
                if(res.admin)
                {
                    $('#applications-display').append('<h5>No applications have been made yet</h5>');
                }
                else
                {
                    $('#applications-display').append(`<h5>You Haven't made an application yet <a href="/applications/create" class="text-colour" style="text-decoration: none;">make one here</a></h5>`);
                }
            }
        }
        else if(res.status == 200)
        {
            let html = ``;

            if(res.admin == false)
            {
                html = `<a href="/applications/create" class="green-btn text-colour">Create New Application</a>`;
            }

            html += `<table id="applications" class="table mt-3">`;
            html += `<tr>`;
            html += `<th class="bg p-2">Created By</th>`;
            html += `<th class="bg p-2">Date Created</th>`;
            html += `<th class="bg p-2">Comments</th>`;
            html += `<th class="bg p-2">Status</th>`;
            html += `<th class="bg p-2"></th>`;
            html += `</tr>`;
            
            for(let i = 0; i < res.applications.length; i++)
            {
                html += `<tr>`;
                html += `<td class="p-2">${res.applications[i].username}</td>`
                html += `<td class="p-2">${timeToDate(res.applications[i].timestamp)}</td>`
                html += `<td class="p-2">${res.applications[i].comments.length}</td>`
                html += `<td class="p-2">${getStatus(res.applications[i].status)}</td>`;
                html += `<td class="p-2"><a href="/applications/view/${res.applications[i]._id}" class="text-deco-none text-colour">View</a></td>`;
                html += `</tr>`;
            }

            html += `</table>`;
            $('#applications-display').html(html);
        }
    });

    setTimeout(() => {
        $('#errors').hide(3000);
    }, 2000);
});