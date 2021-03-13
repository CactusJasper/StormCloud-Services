$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getPollList', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getPollList', {})
        }, (60 * 1000) * 1);
    });

    socket.on('getPollListCb', (res) => {
        if(res.status == 900)
        {
            if(res.message == 'No Polls')
            {
                $('#polls-display').html('<h3 class="center header">No Current Polls Check Back Later</h3>')
            }
        }
        else if(res.status == 200)
        {
            let polls = res.polls;
            let html = `<h2 class="center header">Poll List</h2>`;
            html += `<table id="polls-list" class="table mt-3">`;
            html += `<tr>`;
            html += `<th class="bg p-2">Poll Name</th>`;
            html += `<th class="bg p-2">Date Created</th>`;
            html += `<th class="bg p-2">Vote Count</th>`;
            html += `<th class="bg p-2"></th>`;
            html += `</tr>`;

            for(let i = 0; i < polls.length; i++)
            {
                html += `<tr>`;
                if(i % 2 == 0)
                {
                    html += `<td class="bg-secondary p-2">${polls[i].title}</td>`;
                    html += `<td class="bg-secondary p-2">${timeToDate(polls[i].created_timestamp)}</td>`;
                    html += `<td class="bg-secondary p-2">${polls[i].votes.length}</td>`;
                    html += `<td class="bg-secondary p-2"><a href="/poll/view/${polls[i]._id}" class="text-colour" style="text-decoration: none;">View</a></td>`;
                }
                else
                {
                    html += `<td class="bg p-2">${polls[i].title}</td>`;
                    html += `<td class="bg p-2">${timeToDate(polls[i].created_timestamp)}</td>`;
                    html += `<td class="bg p-2">${polls[i].votes.length}</td>`;
                    html += `<td class="bg p-2"><a href="/poll/view/${polls[i]._id}" class="text-colour" style="text-decoration: none;">View</a></td>`;
                }
                html += `</tr>`;
            }

            html += `</table>`;

            $('#polls-display').html(html);
        }
    });
});