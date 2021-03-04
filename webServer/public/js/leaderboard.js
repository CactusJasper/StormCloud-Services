$(() => {
    let socket = io();
    let duid = userId;
    $('#toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {
            user_id: duid
        });
        socket.emit('getLeaderboard', {});

        setInterval(() => {
            socket.volatile.emit('getLeaderboard', {});
        }, 5 * 1000);

        setInterval(() => {
            socket.volatile.emit('updateUserData', {
                user_id: duid
            });
        }, (60 * 1000) * 10);
    });

    socket.on('leaderboardData', (res) => {
        if(res.status == 500)
        {
            $('#leaderboard-display').append('<h2>Unnable to display leaderboard at this time</h2>');
        }
        else if(res.status == 200)
        {
            if(res.message != undefined)
            {
                $('#leaderboard-display').append('<h2>Unnable to display leaderboard at this time</h2>');
            }
            else
            {
                if(res.data.length > 0)
                {
                    if($('#leaderboard').length >= 1)
                    {
                        html = `<tr>`;
                        html += `<th class="bg p-2">Username</th>`;
                        html += `<th class="bg p-2">Level</th>`;
                        html += `<th class="bg p-2">Current XP</th>`;
                        html += `<th class="bg p-2">Level Up At</th>`;
                        html += `</tr>`;

                        let data = res.data;

                        data.sort((a, b) => {
                            return b.xp - a.xp;
                        });

                        for(let i = 0; i < data.length; i++)
                        {
                            if(i % 2 == 0)
                            {
                                html += `<tr>`;
                                html += `<td class="bg-secondary p-2">${data[i].username}</td>`;
                                html += `<td class="bg-secondary p-2">${data[i].level}</td>`;
                                html += `<td class="bg-secondary p-2">${data[i].xp} XP</td>`;
                                html += `<td class="bg-secondary p-2">${getLevelToXP(data[i].level + 1)} XP</td>`;
                                html += `</tr>`;
                            }
                            else
                            {
                                html += `<tr id="pos-${i}">`;
                                html += `<td class="bg p-2">${data[i].username}</td>`;
                                html += `<td class="bg p-2">${data[i].level}</td>`;
                                html += `<td class="bg p-2">${data[i].xp} XP</td>`;
                                html += `<td class="bg p-2">${getLevelToXP(data[i].level + 1)} XP</td>`;
                                html += `</tr>`;
                            }
                        }

                        $('#leaderboard').html(html);
                    }
                    else
                    {
                        let html = `<h2>User XP Leaderboard</h2>`;
                        html += `<table id="leaderboard" class="table mt-3">`;
                        html += `<tr>`;
                        html += `<th class="bg p-2">Username</th>`;
                        html += `<th class="bg p-2">Level</th>`;
                        html += `<th class="bg p-2">Current XP</th>`;
                        html += `<th class="bg p-2">Level Up At</th>`;
                        html += `</tr>`;

                        let data = res.data;

                        data.sort((a, b) => {
                            return b.xp - a.xp;
                        });

                        for(let i = 0; i < data.length; i++)
                        {
                            if(i % 2 == 0)
                            {
                                html += `<tr>`;
                                html += `<td class="bg-secondary p-2">${data[i].username}</td>`;
                                html += `<td class="bg-secondary p-2">${data[i].level}</td>`;
                                html += `<td class="bg-secondary p-2">${data[i].xp} XP</td>`;
                                html += `<td class="bg-secondary p-2">${getLevelToXP(data[i].level + 1)} XP</td>`;
                                html += `</tr>`;
                            }
                            else
                            {
                                html += `<tr id="pos-${i}">`;
                                html += `<td class="bg p-2">${data[i].username}</td>`;
                                html += `<td class="bg p-2">${data[i].level}</td>`;
                                html += `<td class="bg p-2">${data[i].xp} XP</td>`;
                                html += `<td class="bg p-2">${getLevelToXP(data[i].level + 1)} XP</td>`;
                                html += `</tr>`;
                            }
                        }

                        html += `</table>`;

                        $('#leaderboard-display').append(html);
                    }
                }
                else
                {
                    if($('#leaderboard').length == 0)
                    {
                        $('#leaderboard-display').append('<h2>Unnable to display leaderboard at this time</h2>');
                    }
                }
            }
        }
    });
});