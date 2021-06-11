window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getPlannerEvents', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getPlannerEvents', {});
        }, 5000);
    });

    socket.on('getPlannerEventsCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
            if(res.message == 'No Events')
            {
                document.getElementById('past-events').innerHTML = `<p class="center error">Currently there are no events.</p>`;
            }
            else
            {
                document.getElementById('past-events').innerHTML = `<p class="center error">Something went wrong please try again later.</p>`;
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

            let pastEvents = [];
            for(let i = 0; i < events.length; i++)
            {
                if(events[i].eventTime < currentTime)
                {
                    pastEvents.push(events[i]);
                }
            }

            for(let i = 0; i < pastEvents.length && i < 15; i++)
            {
                html += `<tr>`;
                if(i % 2 == 0)
                {
                    html += `<td class="bg-secondary p-2">${pastEvents[i].eventTitle}</td>`;
                    html += `<td class="bg-secondary p-2">${pastEvents[i].eventDesc.substr(0, 50)}</td>`;
                    html += `<td class="bg-secondary p-2">${new Date(pastEvents[i].eventTime * 1000).toLocaleString()}</td>`;
                    html += `<td class="bg-secondary p-2"><a href="/planner/event/view/${pastEvents[i]._id}" class="text-colour" style="text-decoration: none;">Event Details</a></td>`;
                }
                else
                {
                    html += `<td class="bg p-2">${pastEvents[i].eventTitle}</td>`;
                    html += `<td class="bg p-2">${pastEvents[i].eventDesc.substr(0, 50)}</td>`;
                    html += `<td class="bg p-2">${new Date(pastEvents[i].eventTime * 1000).toLocaleString()}</td>`;
                    html += `<td class="bg p-2"><a href="/planner/event/view/${pastEvents[i]._id}" class="text-colour" style="text-decoration: none;">Event Details</a></td>`;
                }
            }

            html += `</tr>`;
            html += `</table>`;
            document.getElementById('past-events').innerHTML = html;
        }
    });
});