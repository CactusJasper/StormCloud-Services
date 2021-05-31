window.addEventListener('DOMContentLoaded', (event) => {
    let socket = io();
    let maxPages = 1;
    let currentPage = 1;
    let userPagesEl = document.getElementById('userPages');

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getUsers', {
            getMaxPages: true
        });

        setTimeout(() => {
            socket.emit('getUsers', {
                page: currentPage
            });
        }, 500);

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.emit('getUsers', {
                getMaxPages: true
            });

            socket.emit('getUsers', {
                page: currentPage
            });
        }, (60 * 1000) * 5);
    });

    socket.on('getUsersCb', (res) => {
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
                                socket.emit('getUsers', {
                                    page: currentPage
                                });
                            }
                        });
                    }
                }
            }
            else if(res.message == 'Pagination')
            {
                if(res.users.length > 0)
                {
                    let pageEl = document.getElementById(`userPage${res.pageNum}`);
                    
                    if(pageEl == null)
                    {
                        let users = res.users;
                        let html = `<table id="userPage${res.pageNum}" class="table my-5" style="width: 90%; margin-left: 5%;">`;
                        html += `<tr>`;
                        html += `<td class="bg p-2">Username</td>`;
                        html += `<td class="bg p-2">Highest Role</td>`;
                        html += `<td class="bg p-2"></td>`;
                        html += `</tr>`;
                        for(let i = 0; i < users.length; i++)
                        {
                            if(users[i]._id == res.currentUser)
                            {
                                if(users[i].superuser == false)
                                    window.location = '/';
                            }

                            html += `<tr>`;
                            if(i % 2 == 0)
                            {
                                html += `<td class="bg-secondary p-2">${users[i].username}</td>`;
                                html += `<td class="bg-secondary p-2">${highestPerm(users[i])}</td>`;
                                if(users[i]._id == res.currentUser)
                                {
                                    html += `<td class="bg-secondary p-2">Your User</td>`;
                                }
                                else
                                {
                                    html += `<td class="bg-secondary p-2"><a href="/admin/manage/user/${users[i]._id}" class="text-colour" style="text-decoration: none;">Manage User</a></td>`;
                                }
                            }
                            else
                            {
                                html += `<td class="bg p-2">${users[i].username}</td>`;
                                html += `<td class="bg p-2">${highestPerm(users[i])}</td>`;
                                if(users[i]._id == res.currentUser)
                                {
                                    html += `<td class="bg p-2">Your User</td>`;
                                }
                                else
                                {
                                    html += `<td class="bg p-2"><a href="/admin/manage/user/${users[i]._id}" class="text-colour" style="text-decoration: none;">Manage User</a></td>`;
                                }
                            }
                            html += `</tr>`;
                        }
                        html += `</table>`;
                        userPagesEl.innerHTML = html;

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
            else if(res.message == 'All Users')
            {
                let users = res.users;
                let html = `<table id="userPage${res.pageNum}" class="table my-3" style="width: 90%; margin-left: 5%;">`;
                html += `<tr>`;
                html += `<td class="bg p-2">Username</td>`;
                html += `<td class="bg p-2">Highest Role</td>`;
                html += `<td class="bg p-2"></td>`
                html += `</tr>`
                for(let i = 0; i < users.length; i++)
                {
                    if(users[i]._id == res.currentUser)
                    {
                        if(users[i].superuser == false)
                            window.location = '/';
                    }

                    html += `<tr>`;
                    if(i % 2 == 0)
                    {
                        html += `<td class="bg-secondary p-2">${users[i].username}</td>`;
                        html += `<td class="bg-secondary p-2">${highestPerm(users[i])}</td>`;
                        if(users[i]._id == res.currentUser)
                        {
                            html += `<td class="bg-secondary p-2">Your User</td>`;
                        }
                        else
                        {
                            html += `<td class="bg-secondary p-2"><a href="/admin/manage/user/${users[i]._id}" class="text-colour" style="text-decoration: none;">Manage User</a></td>`;
                        }
                    }
                    else
                    {
                        html += `<td class="bg p-2">${users[i].username}</td>`;
                        html += `<td class="bg p-2">${highestPerm(users[i])}</td>`;
                        if(users[i]._id == res.currentUser)
                        {
                            html += `<td class="bg p-2">Your User</td>`;
                        }
                        else
                        {
                            html += `<td class="bg p-2"><a href="/admin/manage/user/${users[i]._id}" class="text-colour" style="text-decoration: none;">Manage User</a></td>`;
                        }
                    }
                    html += `</tr>`;
                }
                html += `</table>`;
                userPagesEl.innerHTML = html;
            }
        }
    });

    function highestPerm(user)
    {
        if(user.superuser == true)
        {
            return 'Superuser';
        }
        else if(user.admin == true)
        {
            return 'Admin';
        }
        else if(user.event_manager == true)
        {
            return 'Event Manager';
        }
        else
        {
            return 'User';
        }
    }
});