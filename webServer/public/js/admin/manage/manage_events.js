window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let maxPages = 1;
    let currentPage = 1;
    let eventPagesEl = document.getElementById('eventPages');

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getEvents', {
            getMaxPages: true
        });

        setTimeout(() => {
            socket.emit('getEvents', {
                page: currentPage
            });
        }, 500);

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.emit('getEvents', {
                getMaxPages: true
            });

            socket.emit('getEvents', {
                page: currentPage
            });
        }, (60 * 1000) * 5);
    });

    socket.on('getEventsCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
            if(res.message == 'Unauthorised')
                window.history.back();
            else if(res.message == 'No Events')
                document.getElementById('errors').innerHTML = `<p class="center error">There are currently no planned events.</p>`;
            else
                document.getElementById('errors').innerHTML = `<p class="center error">Something went wrong try again later.</p>`;
        }
        else if(res.status == 200)
        {
            if(res.message == 'MaxPages')
            {
                maxPages = res.maxPages;
                let btnHolder = document.getElementById('pageButtons');
                let html = `<a id="page1" class="page-btn-selected p-1 mt-1 text-colour">1</a>`;

                if(maxPages > 1)
                {
                    for(let i = 2; i <= maxPages; i++)
                    {
                        html += `<a id="page${i}" class="page-btn p-1 mt-1 text-colour">${i}</a>`;
                    }
                }

                btnHolder.innerHTML = html;

                if(maxPages > 1)
                {
                    for(let i = 1; i <= maxPages; i++)
                    {
                        document.getElementById(`page${i}`).addEventListener('click', (event) => {
                            if(event.target.classList.contains('page-btn'))
                            {
                                currentPage = event.target.id.substring(4, event.target.id.length);
                                socket.emit('getEvents', {
                                    page: currentPage
                                });
                            }
                        });
                    }
                }
            }
            else if(res.message == 'Pagination')
            {
                if(res.events.length > 0)
                {
                    let pageEl = document.getElementById(`eventsPage${res.pageNum}`);

                    if(pageEl == null)
                    {
                        let events = res.events;
                        let html = `<table id="eventsPage${res.pageNum}" class="table my-5" style="width: 90%; margin-left: 5%;">`;
                        html += `<tr>`;
                        html += `<td class="bg p-2">Title</td>`;
                        html += `<td class="bg p-2">Approved</td>`;
                        html += `<td class="bg p-2">Event Time/Date</td>`;
                        html += `<td class="bg p-2"></td>`;
                        html += `</tr>`;

                        for(let i = 0; i < events.length; i++)
                        {
                            html += `<tr>`;
                            if(i % 2 == 0)
                            {
                                html += `<td class="bg-secondary p-2">${events[i].eventTitle}</td>`;
                                html += `<td class="bg-secondary p-2">${isApproved(events[i])}</td>`;
                                html += `<td class="bg-secondary p-2">${new Date(events[i].eventTime * 1000).toLocaleString()}</td>`;
                                html += `<td class="bg-secondary p-2"><a href="/admin/manage/event/${events[i]._id}" class="text-colour" style="text-decoration: none;">Event Details</a></td>`;
                            }
                            else
                            {
                                html += `<td class="bg p-2">${events[i].eventTitle}</td>`;
                                html += `<td class="bg p-2">${isApproved(events[i])}</td>`;
                                html += `<td class="bg p-2">${new Date(events[i].eventTime * 1000).toLocaleString()}</td>`;
                                html += `<td class="bg p-2"><a href="/admin/manage/event/${events[i]._id}" class="text-colour" style="text-decoration: none;">Event Details</a></td>`;
                            }
                            html += `</tr>`;
                        }

                        html += `</table>`;
                        eventPagesEl.innerHTML = html;

                        for(let i = 1; i <= maxPages; i++)
                        {
                            if(document.getElementById(`page${i}`).classList.contains('page-btn-selected'))
                            {
                                document.getElementById(`page${i}`).classList.remove('page-btn-selected');
                                document.getElementById(`page${i}`).classList.add('page-btn');
                            }
                        }

                        document.getElementById(`page${currentPage}`).classList.add('page-btn-selected');
                    }
                }
            }
            else if(res.message == 'All Events')
            {
                let events = res.events;
                let html = `<table id="eventsPage${res.pageNum}" class="table my-5" style="width: 90%; margin-left: 5%;">`;
                html += `<tr>`;
                html += `<td class="bg p-2">Title</td>`;
                html += `<td class="bg p-2">Approved</td>`;
                html += `<td class="bg p-2">Event Time/Date</td>`;
                html += `<td class="bg p-2"></td>`;
                html += `</tr>`;

                for(let i = 0; i < events.length; i++)
                {
                    html += `<tr>`;
                    if(i % 2 == 0)
                    {
                        html += `<td class="bg-secondary p-2">${events[i].eventTitle}</td>`;
                        html += `<td class="bg-secondary p-2">${isApproved(events[i])}</td>`;
                        html += `<td class="bg-secondary p-2">${new Date(events[i].eventTime * 1000).toLocaleString()}</td>`;
                        html += `<td class="bg p-2"></td>`;
                    }
                    else
                    {
                        html += `<td class="bg p-2">${events[i].eventTitle}</td>`;
                        html += `<td class="bg p-2">${isApproved(events[i])}</td>`;
                        html += `<td class="bg p-2">${new Date(events[i].eventTime * 1000).toLocaleString()}</td>`;
                        html += `<td class="bg p-2"></td>`;
                    }
                    html += `</tr>`;
                }

                html += `</table>`;
                eventPagesEl.innerHTML = html;
            }
        }
    });

    function isApproved(event)
    {
        if(event.approved)
            return 'Yes';
        else
            return 'No';
    }
});