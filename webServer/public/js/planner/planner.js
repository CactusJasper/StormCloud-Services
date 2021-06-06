$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getUpcomingEvents', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volitile.emit('getUpcomingEvents', {});
        }, 5000);
    });

    socket.on('getUpcomingEventsCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
            if(res.message == 'No Events')
            {
                document.getElementById('upcoming-events').innerHTML = `<p class="center error">Currently there are no planned events.</p>`;
            }
            else
            {
                document.getElementById('upcoming-events').innerHTML = `<p class="center error">Something went wrong please try again later.</p>`;
            }
        }
        else if(res.status == 200)
        {
            let events = res.events;
            let currentTime = Math.floor(new Date().getTime() / 1000.0);

            let html = `<table class="table my-3">`;
            html += `<tr>`;
            html += `<td class="bg p-2">Title</td>`;
            html += `<td class="bg p-2">Description</td>`;
            html += `<td class="bg p-2">Event Time/Date</td>`;
            html += `<td class="bg p-2"></td>`;
            html += `</tr>`;

            let upcomingEvents = [];
            for(let i = 0; i < events.length; i++)
            {
                if(events[i].eventTime >= currentTime)
                {
                    upcomingEvents.push(events[i]);
                }
            }

            for(let i = 0; i < upcomingEvents.length && i < 15; i++)
            {
                html += `<tr>`;
                if(i % 2 == 0)
                {
                    html += `<td class="bg-secondary p-2">${upcomingEvents[i].eventTitle}</td>`;
                    html += `<td class="bg-secondary p-2">${upcomingEvents[i].eventDesc.substr(0, 50)}</td>`;
                    html += `<td class="bg-secondary p-2">${new Date(upcomingEvents[i].eventTime * 1000).toLocaleString()}</td>`;
                    html += `<td class="bg-secondary p-2"><a href="/planner/event/view/${upcomingEvents[i]._id}" class="text-colour" style="text-decoration: none;">Event Details</a></td>`;
                }
                else
                {
                    html += `<td class="bg p-2">${upcomingEvents[i].eventTitle}</td>`;
                    html += `<td class="bg p-2">${upcomingEvents[i].eventDesc.substr(0, 50)}</td>`;
                    html += `<td class="bg p-2">${new Date(upcomingEvents[i].eventTime * 1000).toLocaleString()}</td>`;
                    html += `<td class="bg p-2"><a href="/planner/event/view/${upcomingEvents[i]._id}" class="text-colour" style="text-decoration: none;">Event Details</a></td>`;
                }
            }

            html += `</tr>`;
            html += `</table>`;
            document.getElementById('upcoming-events').innerHTML = html;
        }
    });
});