$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getNeedApproval', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    socket.on('needApprovalList', (res) => {
        if(res.status == 500)
        {
            $('#polls-display').html('<p class="center error">Something went wrong check back later.</p>')
        }
        else if(res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                window.history.back();
            }
            else if(res.message == 'No Polls')
            {
                $('#polls-display').html('<p class="center error">No Polls have been made at this moment in time.</p>');
            }
        }
        else if(res.status == 200)
        {
            let polls = res.polls;

            let html = `<table id="polls-list" class="table mt-3">`;
            html += `<tr>`;
            html += `<th class="bg p-2">Poll Name</th>`;
            html += `<th class="bg p-2">Date Created</th>`;
            html += `<th class="bg p-2"></th>`;
            html += `</tr>`;

            for(let i = 0; i < polls.length; i++)
            {
                html += `<tr>`;
                if(i % 2 == 0)
                {
                    html += `<td class="bg-secondary p-2">${polls[i].title}</td>`;
                    html += `<td class="bg-secondary p-2">${timeToDate(polls[i].created_timestamp)}</td>`;
                    html += `<td class="bg-secondary p-2"><a href="/poll/view/${polls[i]._id}" class="text-colour mr-3" style="text-decoration: none;">View</a></td>`;
                }
                else
                {
                    html += `<td class="bg p-2">${polls[i].title}</td>`;
                    html += `<td class="bg p-2">${timeToDate(polls[i].created_timestamp)}</td>`;
                    html += `<td class="bg p-2"><a href="/poll/view/${polls[i]._id}" class="text-colour mr-3" style="text-decoration: none;">View</a></td>`;
                }
                html += `</tr>`;
            }

            html += `</table>`;

            $('#polls-display').html(html);
        }
    });
});