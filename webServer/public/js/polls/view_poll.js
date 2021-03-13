$(() => {
    let socket = io();
    let pid = pollId;
    let duid = userId;
    $('#toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('getPoll', {
            pollId: pid
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);

        setInterval(() => {
            socket.volatile.emit('getPollData', {
                pollId: pid
            })
        }, (60 * 1000) * 5);
    });

    socket.on('getPollCb', (res) => {
        $('#poll').html('');
        if(res.status == 500)
        {
            $('#poll').html('<h3 class="center">Something went wrong try again later.</h3>')
        }
        else if(res.status == 900)
        {
            if(res.message == 'Invalid Poll Id')
            {
                window.location.href = '/';
            }
            else if(res.message == 'Unauthorised')
            {
                window.location.href = '/';
            }
        }
        else if(res.status == 200)
        {
            let poll = res.poll;
            let hasVoted = false;
            let vote;

            if(poll.votes.length > 0)
            {
                for(let i = 0; i < poll.votes.length; i++)
                {
                    if(poll.votes[i].user_id == res.currentUser)
                    {
                        hasVoted = true;
                        vote = poll.votes[i];
                    }
                }
            }

            if(poll.state == 1)
            {
                $('#poll').append(`<h3 class="center header">${poll.title}</h3>`);
                $('#poll').append(`<p class="center mt-2">${poll.description}</p>`);
                $('#poll').append(`<p class="center mt-2">Total Votes: ${poll.votes.length}</p>`);
                if(hasVoted == false)
                {
                    let form = `<form id="poll-vote" class="form-style">`;
                    form += `<div class="seperator my-4"></div>`;
                    form += `<p class="error mb-2" id="poll-vote-err"></p>`
                    form += `<p class="mb-2">Options:</p>`
                    for(let i = 0; i < poll.options.length; i++)
                    {
                        form += `<input class="form-check-input my-1" type="radio" name="pollOption" id="option${poll.options[i].value}" value="${poll.options[i].value}">`
                        form += `<label class="form-check-label input-hover" for="option${poll.options[i].value}">${poll.options[i].vote_string}</label></br>`;
                    }
                    form += `<div class="seperator my-4"></div>`;
                    form += `<input type="submit" class="mt-3 text-colour" id="cast-vote" value="Cast Vote"/>`;
                    form += `</form>`;

                    $('#poll').append(form);

                    $('#cast-vote').click((event) => {
                        event.preventDefault();
                        let vote = $('#poll-vote').serializeArray()[0];
                        if(vote != undefined)
                        {
                            socket.emit('castVote', {
                                pollId: pid,
                                option: vote.value
                            });
                        }
                        else
                        {
                            $('#poll-vote-err').text('Please select a option to vote for.');
                        }
                    });
                }
                else
                {
                    $('#poll').append(`<p class="center mt-3">You have voted for ${poll.options[vote.option - 1].vote_string}</p>`);
                    $('#poll').append(`<div id="poll-results"></div>`);
                    socket.emit('getPollData', {
                        pollId: pid
                    });
                }
            }
            else
            {
                // Closed Poll
            }
        }
    });

    socket.on('getPollDataCb', (res) => {
        if(res.status == 500)
        {
            if($('#poll-results')[0] == undefined)
            {
                $('#poll').append('<div id="poll-results"><h3 class="center">Unable to get poll results at this time</h3></div>');   
            }
        }
        else if(res.status == 900)
        {
            if(res.message == 'Invalid Poll Id')
            {
                window.location.href = '/';
            }
        }
        else if(res.status == 200)
        {
            $('#poll-results').html('');

            let poll = res.poll;
            let html = `<h4 class="header mt-4">Poll Votes</h4>`;
            let results = getPollResults(poll);
            html += `<div class="results">`;

            for(let i = 0; i < poll.options.length; i++)
            {
                let percentage = Math.round(((results[i] / poll.votes.length) * 100));
                html += `<div class="result">`;
                html += `<div class="result-name">${poll.options[i].vote_string}</div>`;
                html += `<div class="result-bar bg">`;
                html += `<div class="result-per" per="${percentage}"></div>`;
                html += `</div>`;
                html += `</div>`;
            }            

            html += `</div>`;
            
            $('#poll-results').html(html);
            let resultsPer = $('.result-per');

            for(let i = 0; i < resultsPer.length; i++)
            {
                updateSliders($(resultsPer[i]));
            }
        }
    });

    socket.on('castVoteCb', (res) => {
        if(res.status == 500)
        {
            $('#poll-vote-err').text('Something went wrong please try again later.');
        }
        else if(res.status == 900)
        {
            if(res.message == 'Invalid Poll Id')
            {
                window.location.href = '/';
            }
            else if(res.message == 'No Vote Option')
            {
                $('#poll-vote-err').text('No poll option was passed please try again.');
            }
            else if(res.message == 'Invalid Vote Option')
            {
                $('#poll-vote-err').text('Invalid poll option.');
            }
            else if(res.message == 'Already Voted')
            {
                window.location.reload();
            }
        }
        else if(res.status == 200)
        {
            let poll = res.poll;
            let hasVoted = false;
            let vote;

            if(poll.votes.length > 0)
            {
                for(let i = 0; i < poll.votes.length; i++)
                {
                    if(poll.votes[i].user_id == duid)
                    {
                        hasVoted = true;
                        vote = poll.votes[i];
                    }
                }
            }

            if(hasVoted == true)
            {
                $('#poll').html('');
                $('#poll').append(`<h3 class="center header">${poll.title}</h3>`);
                $('#poll').append(`<p class="center mt-2">${poll.description}</p>`);
                $('#poll').append(`<p class="center mt-2">Total Votes: ${poll.votes.length}</p>`);
                $('#poll').append(`<p class="center mt-3">You have voted for ${poll.options[vote.option - 1].vote_string}</p>`);
                $('#poll').append(`<div id="poll-results"></div>`);
                socket.emit('getPollData', {
                    pollId: pid
                });
            }
        }
    });

    socket.on(`voteCast:${pid}`, (res) => {
        let poll = res.poll;
        let hasVoted = false;
        let vote;

        if(poll.votes.length > 0)
        {
            for(let i = 0; i < poll.votes.length; i++)
            {
                if(poll.votes[i].user_id == duid)
                {
                    hasVoted = true;
                    vote = poll.votes[i];
                }
            }
        }

        if(hasVoted == true)
        {
            if($('#poll-results')[0] != undefined)
            {
                socket.emit('getPollData', {
                    pollId: pid
                });
            }
            else
            {
                $('#poll').html('');
                $('#poll').append(`<h3 class="center header">${poll.title}</h3>`);
                $('#poll').append(`<p class="center mt-2">${poll.description}</p>`);
                $('#poll').append(`<p class="center mt-2">Total Votes: ${poll.votes.length}</p>`);
                $('#poll').append(`<p class="center mt-3">You have voted for ${poll.options[vote.option - 1].vote_string}</p>`);
                $('#poll').append(`<div id="poll-results"></div>`);
                socket.emit('getPollData', {
                    pollId: pid
                });
            }
        }
    });
});

function updateSliders(currentElement)
{
    let per = currentElement.attr('per');
    currentElement.css('width', per + '%');
    $({ animatedValue: 0 }).animate({ animatedValue: per }, {
        duration: 2000,
        step: (now, fx) => {
            currentElement.attr('per', Math.floor(now));
        }
    });
}