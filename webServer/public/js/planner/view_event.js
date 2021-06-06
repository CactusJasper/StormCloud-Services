window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let eventId = eid;
    document.getElementById('toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getEventData', {
            eventId: eventId
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getEventData', {
                eventId: eventId
            });
        }, (60 * 1000) * 2);
    });

    socket.on('getEventDataCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
            if(res.message == 'Internal Server Error')
            {
                document.getElementById('event-data').innerHTML = `<p class="center error">Something went wrong please try again later.</p>`;
            }
            else
            {
                window.location = '/planner';
            }
        }
        else if(res.status == 200)
        {
            let event = res.event;
            let html =  `<h3 class="center header mt-4">${event.eventTitle}</h3>`;
            html += `<p class="center mt-3">Event Description: </p>`;
            html += `<p class="center mt-2">${event.eventDesc}</p>`;
            html += `<p class="center mt-2">Voice Call: ${event.voiceCall}</p>`;
            if(typeof event.game !== "undefined")
            {
                html += `<p class="center mt-2">Event Game: ${event.game}</p>`;
            }
            html += `<p class="center mt-2">Event Date/Time: ${new Date(event.eventTime * 1000).toLocaleString()}</p>`
            let currentDate = Math.floor(new Date().getTime() / 1000);

            if(event.eventTime < currentDate)
            {
                html += `<p class="center mt-2">Event State: Ended</p>`;
            }
            else
            {
                html += `<p class="center mt-2">Event State: Upcoming</p>`;
            }

            document.getElementById('event-data').innerHTML = html;
        }
    });
});