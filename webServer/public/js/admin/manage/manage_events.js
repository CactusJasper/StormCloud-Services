window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let maxPages = 1;
    let currentPage = 1;
    let eventPagesEl = document.getElementById('eventPages');

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    socket.on('getEventsCb', (res) => {
        if(res.status == 500 || res.status == 900)
        {
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
                        html += `<td class="bg p-2">Time</td>`;
                        html += `<td class="bg p-2"></td>`;
                        html += `</tr>`;
                    }
                }
            }
        }
    });
});