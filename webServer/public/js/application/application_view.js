$(() => {
    let socket = io();
    let duid = userId;
    let appId = applicationId;
    $('#toRemove').remove();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {
            user_id: duid
        });
        socket.emit('getApplication', {
            applicationId: appId,
            userId: duid
        });

        setInterval(() => {
            socket.volatile.emit('updateUserData', {
                user_id: duid
            });
        }, (60 * 1000) * 10);
    });

    socket.on(`applicationData`, (res) => {
        $('#application-data').html('');

        if(res.status == 500)
        {
            $('#application-data').append('<h3>Unable to get this Application at this time.</h3>');
        }
        else if(res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                window.history.back();
            }
            else if(res.message == 'No Application ID Provided')
            {
                $('#application-data').append('<h3>Unable to get this Application at this time.</h3>');
            }
            else if(res.message == 'Invalid Application ID')
            {
                window.history.back();
            }
        }
        else if(res.status == 200)
        {
            $('#application-data').append(`<h4 class="center text-colour">Mod Application By ${res.application.username}</h4>`);
            $('#application-data').append(`<p class="center text-colour">${timeToDate(res.application.timestamp)}</p>`);
            $('#application-data').append(`<div class="seperator my-4"></div>`);
            $('#application-data').append(`<p class="mt-4 text-colour">Q1. Have you been with the server for longer than a month?</p>`);
            $('#application-data').append(`<p class="mt-2 text-colour">${res.application.first_question}</p>`);
            $('#application-data').append(`<div class="seperator my-4"></div>`);
            $('#application-data').append(`<p class="mt-4">Q2. Why do you want trial mod?</p>`);
            $('#application-data').append(`<p class="mt-2 text-colour">${res.application.second_question}</p>`);
            $('#application-data').append(`<div class="seperator my-4"></div>`);
            $('#application-data').append(`<p class="mt-4">Q3. How much are you active on discord?</p>`);
            $('#application-data').append(`<p class="mt-2 text-colour">${res.application.third_question}</p>`);
            $('#application-data').append(`<div class="seperator my-4"></div>`);
            $('#application-data').append(`<p class="mt-4">Q4. How about activity on the server?</p>`);
            $('#application-data').append(`<p class="mt-2 text-colour">${res.application.fourth_question}</p>`);
            $('#application-data').append(`<div class="seperator my-4"></div>`);
            $('#application-data').append(`<p class="mt-4">Q5. Do you agree to be a moderator by all of these terms and agree to server rules?</p>`);
            $('#application-data').append(`<p class="mt-2 text-colour">${res.application.fith_question}</p>`);
            if(res.application.sixth_question !== undefined && res.application.seventh_question !== undefined)
            {
                $('#application-data').append(`<div class="seperator my-4"></div>`);
                $('#application-data').append(`<p class="mt-4">Q6. What is one goal you would have as a moderator?</p>`);
                $('#application-data').append(`<p class="mt-2 text-colour">${res.application.sixth_question}</p>`);
                $('#application-data').append(`<div class="seperator my-4"></div>`);
                $('#application-data').append(`<p class="mt-4">Q7. How do you plan to achieve this goal?</p>`);
                $('#application-data').append(`<p class="mt-2 text-colour">${res.application.seventh_question}</p>`);
                $('#application-data').append(`<div class="seperator my-4"></div>`);
            }
            else
            {
                $('#application-data').append(`<div class="seperator my-4"></div>`);
            }

            if(res.application.status == 0)
            {
                if(res.admin)
                {
                    let hasVoted = false;
                    let yourVote;
                    let approves = 0;
                    let disapproves = 0;
                    for(let i = 0; i < res.application.votes.length; i++)
                    {
                        if(res.application.votes[i].user_id == duid)
                        {
                            hasVoted = true;
                            yourVote = res.application.votes[i].vote
                        }

                        if(res.application.votes[i].vote)
                        {
                            approves++;
                        }
                        else
                        {
                            disapproves++;
                        }
                    }

                    if(hasVoted)
                    {
                        $('#application-data').append(`<p id="vote-outcomes" class="mt-4">Approves: ${approves} | Disapproves: ${disapproves}</p>`);
                        if(hasVoted == true)
                        {
                            $('#application-data').append(`<p class="my-4">You voted Approve!</p>`);
                        }
                        else if(hasVoted == false)
                        {
                            $('#application-data').append(`<p class="my-4">You voted Disapprove!</p>`);
                        }
                    }
                    else
                    {
                        $('#application-data').append(`<p id="vote-outcomes" class="mt-4">Approves: ${approves} | Disapproves: ${disapproves}</p>`);

                        if(res.wolfy == false)
                        {
                            $('#application-data').append('<button class="green-btn vote-btn text-colour" style="float: left;" id="approve-vote">Approve</button>');
                            $('#application-data').append('<button class="green-btn vote-btn text-colour ml-4" style="float: left;" id="disapprove-vote">Disapprove</button>');

                            $('#approve-vote').click(() => {
                                socket.emit('vote', {
                                    userId: duid,
                                    applicationId: appId,
                                    vote: true
                                });
                            });
                        
                            $('#disapprove-vote').click(() => {
                                socket.emit('vote', {
                                    userId: duid,
                                    applicationId: appId,
                                    vote: false
                                });
                            });
                        }
                        else
                        {
                            $('#application-data').append('<button class="green-btn text-colour" style="float: left;" id="final-approve-vote">Final Approve</button>');
                            $('#application-data').append('<button class="green-btn text-colour ml-4" style="float: left;" id="final-disapprove-vote">Final Disapprove</button>');

                            $('#final-approve-vote').click(() => {
                                socket.emit('finalVote', {
                                    userId: duid,
                                    applicationId: appId,
                                    approve: true
                                });
                            });
                        
                            $('#final-disapprove-vote').click(() => {
                                socket.emit('finalVote', {
                                    userId: duid,
                                    applicationId: appId,
                                    approve: false
                                });
                            });
                        }
                    }
                }
                else
                {
                    let approves = 0;
                    let disapproves = 0;
                    for(let i = 0; i < res.application.votes.length; i++)
                    {
                        if(res.application.votes[i].vote)
                        {
                            approves++;
                        }
                        else
                        {
                            disapproves++;
                        }
                    }
                    $('#application-data').append(`<p id="vote-outcomes" class="my-4">Approves: ${approves} | Disapproves: ${disapproves}</p>`);
                }

                $('#comment-wrapper').html('');
                let commentBox = `<div class="row justify-content-center">`;
                commentBox += `<div class="col-7 p-4 mb-5 bg-core form-style">`;
                commentBox += `<h3>Write a comment</h3>`;
                commentBox += `<p class="error" id="comment-error-msg"></p>`
                commentBox += `<textarea class="mt-2 rounded text-colour" style="width: 98%;" maxlength="250" id="comment-content" name="comment-content" rows="4" placeholder=""></textarea>`;
                commentBox += `<p class="right mt-2" id="comment-char-count">You have 250 characters left.</p>`;
                commentBox += `<button id="create-comment" class="green-btn text-colour" style="float: left; margin: 0;">Create Comment</button>`;
                commentBox += `</div>`;
                commentBox += `</div>`;
                $('#comment-wrapper').append(commentBox);

                $('#create-comment').click(() => {
                    socket.emit('createComment', {
                        userId: duid,
                        applicationId: appId,
                        commentContent: $('#comment-content').val()
                    });
                });

                $('#comment-content').on('input', (event) => {
                    let char = $('#comment-content').val().length;
                    rem = 250 - char;
                    if(rem <= 0)
                    {
                        $('#comment-content').val($("#comment-content").val().slice(0, 250));
                        return $("#comment-char-count").text("You have 0 characters left.");
                    }
                    $("#comment-char-count").text("You have " + rem + " characters left.");
                });

                let html = `<div class="row justify-content-center">`;
                let application = res.application;
                application.comments.reverse();

                for(let i = 0; i < res.application.comments.length; i++)
                {
                    html +=`<div class="col-7 p-4 mb-5 bg-core">`;
                    html += `<p>Comment by ${res.application.comments[i].username}</p>`;
                    html += `<p>${timeToDate(res.application.comments[i].timestamp)}</p>`;
                    html += `<p class="mt-4">${res.application.comments[i].content}</p>`;
                    html += `</div>`;
                }
                html += `</div>`;

                $('#comments-wrapper').html('');
                $('#comments-wrapper').append(html);
            }
            else
            {
                if(res.admin)
                {
                    let hasVoted = false;
                    let yourVote;
                    let approves = 0;
                    let disapproves = 0;
                    for(let i = 0; i < res.application.votes.length; i++)
                    {
                        if(res.application.votes[i].user_id == duid)
                        {
                            hasVoted = true;
                            yourVote = res.application.votes[i].vote
                        }

                        if(res.application.votes[i].vote)
                        {
                            approves++;
                        }
                        else
                        {
                            disapproves++;
                        }
                    }

                    if(hasVoted)
                    {
                        $('#application-data').append(`<p id="vote-outcomes" class="mt-4">Approves: ${approves} | Disapproves: ${disapproves}</p>`);
                        if(hasVoted == true)
                        {
                            $('#application-data').append(`<p class="my-4">You voted Approve!</p>`);
                        }
                        else if(hasVoted == false)
                        {
                            $('#application-data').append(`<p class="my-4">You voted Disapprove!</p>`);
                        }
                    }
                    else
                    {
                        $('#application-data').append(`<p id="vote-outcomes" class="mt-4">Approves: ${approves} | Disapproves: ${disapproves}</p>`);
                    }
                }
                else
                {
                    $('#application-data').append(`<p class="mt-4">Voting has ended you should have a Message from SC Services telling you the outcome</p>`);
                }
            }
            
        }
    });
    
    socket.on('voteRes', (res) => {
        if(res.status == 500)
        {
            
        }
        else if(res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                $('#approve-vote').remove();
                $('#disapprove-vote').remove();
            }
            else if(res.message == 'Voting Ended')
            {
                $('#approve-vote').remove();
                $('#disapprove-vote').remove();
            }
            else if(res.message == 'Invalid Application ID')
            {
                window.history.back();
            }
            else if(res.message == 'No Application ID Provided')
            {
                window.history.back();
            }
        }
        else if(res.status == 200)
        {
            let hasVoted = false;
            let yourVote;
            let approves = 0;
            let disapproves = 0;
            for(let i = 0; i < res.application.votes.length; i++)
            {
                if(res.application.votes[i].user_id == duid)
                {
                    hasVoted = true;
                    yourVote = res.application.votes[i].vote
                }

                if(res.application.votes[i].vote)
                {
                    approves++;
                }
                else
                {
                    disapproves++;
                }
            }

            $('#approve-vote').remove();
            $('#disapprove-vote').remove();

            if(hasVoted)
            {
                $('#vote-outcomes').text(`Approves: ${approves} | Disapproves: ${disapproves}`);
                if(hasVoted == true)
                {
                    $('#application-data').append(`<p class="my-4">You voted Approve!</p>`);
                }
                else if(hasVoted == false)
                {
                    $('#application-data').append(`<p class="my-4">You voted Disapprove!</p>`);
                }
            }
            else
            {
                $('#vote-outcomes').text(`Approves: ${approves} | Disapproves: ${disapproves}`);
            }
        }
    });

    socket.on('finalVoteRes', (res) => {
        if(res.status == 500)
        {

        }
        else if(res.status == 900)
        {
            if(res.message == 'Unauthorised')
            {
                $('#approve-vote').remove();
                $('#disapprove-vote').remove();
            }
            else if(res.message == 'Voting Ended')
            {
                $('#approve-vote').remove();
                $('#disapprove-vote').remove();
            }
            else if(res.message == 'Invalid Application ID')
            {
                window.history.back();
            }
            else if(res.message == 'No Application ID Provided')
            {
                window.history.back();
            }
        }
        else if(res.status == 200)
        {
            let hasVoted = false;
            let yourVote;
            let approves = 0;
            let disapproves = 0;
            for(let i = 0; i < res.application.votes.length; i++)
            {
                if(res.application.votes[i].user_id == duid)
                {
                    hasVoted = true;
                    yourVote = res.application.votes[i].vote
                }

                if(res.application.votes[i].vote)
                {
                    approves++;
                }
                else
                {
                    disapproves++;
                }
            }

            $('#final-approve-vote').remove();
            $('#final-disapprove-vote').remove();

            if(hasVoted)
            {
                $('#vote-outcomes').text(`Approves: ${approves} | Disapproves: ${disapproves}`);
                if(hasVoted == true)
                {
                    $('#application-data').append(`<p class="my-4">You voted Approve!</p>`);
                }
                else if(hasVoted == false)
                {
                    $('#application-data').append(`<p class="my-4">You voted Disapprove!</p>`);
                }
            }
            else
            {
                $('#vote-outcomes').text(`Approves: ${approves} | Disapproves: ${disapproves}`);
            }
        }
    });

    socket.on(`commentRes`, (res) => {
        if(res.status == 500)
        {

        }
        else if(res.status == 900)
        {
            if(res.message == `No Application ID Provided`)
            {
                window.history.back();
            }
            else if(res.message == 'Unauthorised')
            {
                window.history.back();
            }
            else if(res.message == 'No Application Found')
            {
                window.history.back();
            }
            else if(res.message == 'Please provide text to submit as the comment')
            {
                $('#comment-error-msg').text('Please provide a message to comment.');
            }
            else if(res.message == 'Comment content can be a maximum of 250 characters')
            {
                $('#comment-error-msg').text(`A comment's message can only be 250 characters maximum.`);
            }
        }
        else if(res.status == 200)
        {
            $('#comment-error-msg').text(``);
            $('#comment-content').val('');
            $("#comment-char-count").text("You have 250 characters left.");
        }
    });

    socket.on(`commentRes:${appId}`, (res) => {
        let html = `<div class="row justify-content-center">`;
        let application = res.application;
        application.comments.reverse();
        for(let i = 0; i < application.comments.length; i++)
        {
            html +=`<div class="col-7 p-4 mb-5 bg-core">`;
            html += `<p>Comment by ${application.comments[i].username}</p>`;
            html += `<p>${timeToDate(application.comments[i].timestamp)}</p>`;
            html += `<p class="mt-4">${application.comments[i].content}</p>`;
            html += `</div>`;
        }
        html += `</div>`;

        $('#comments-wrapper').html('');
        $('#comments-wrapper').append(html);
    });
});