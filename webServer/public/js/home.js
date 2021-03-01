$(() => {
    let socket = io();
    let duid = userId;
    $('#toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('t10', {});
        socket.emit('updateUserData', {
            user_id: duid
        });

        socket.emit('getApplications', {
            user_id: duid
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {
                user_id: duid
            });

            socket.volatile.emit('t10', {});
            socket.volatile.emit('updateUserData', {
                user_id: duid
            });
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('t10', {});
            socket.volatile.emit('updateUserData', {
                user_id: duid
            });
        }, (60 * 1000) * 5);
    });

    socket.on('t10', (res) => {
        let top10 = res.data;
        $('#t-10').html('');

        if(res.status == 500)
        {
            $('#t-10').append('<p>Unnable to get top 10 at this time.</p>');
        }
        else if(res.status == 900)
        {
            if(res.message == 'No User Data')
            {
                $('#t-10').append('<p>No data currently available.</p>');
            }
        }
        else if(res.status == 200)
        {
            for(let i = 0; i  < top10.length; i++)
            {
                $('#t-10').append(`<li>${top10[i].username}: Level ${top10[i].level}</li>`);
            }

            if(top10.length == 10)
            {
                $('#t-10').append(`<a href="/user/data/leaderboard" class="text-colour">See Full Leaderboard</a>`);
            }
        }
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
});