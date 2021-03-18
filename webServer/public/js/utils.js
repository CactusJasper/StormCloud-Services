function timeToDate(timestamp)
{
    let date = new Date(timestamp * 1000);
    return `Created on ${date.toLocaleDateString()} at ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
}

function getStatus(status)
{
    if(status == 0)
    {
        return 'Open';
    }
    else
    {
        return 'Closed';
    }
}

function getLevelToXP(level)
{
    return (Math.round((100 + (level * 11.89) * 6) + (level * 3.76)) * 2) * level;
}

function getPollStatus(state)
{
    if(state == 0)
    {
        return 'Awaiting Approval';
    }
    else if(state == 1)
    {
        return 'In Progress';
    }
    else if(state == 2)
    {
        return 'Voting Ended';
    }
}

function getPollResults(poll)
{
    let opt1 = 0;
    let opt2 = 0;
    let opt3 = 0;
    let opt4 = 0;
    let opt5 = 0;
    let opt6 = 0;
    let opt7 = 0;
    let opt8 = 0;
    let opt9 = 0;
    let opt10 = 0;
    let opt11 = 0;
    let opt12 = 0;
    let opt13 = 0;
    let opt14 = 0;
    let opt15 = 0;

    for(let i = 0; i < poll.votes.length; i++)
    {
        if(poll.votes[i].option == 1)
            opt1++;
        else if(poll.votes[i].option == 2)
            opt2++;
        else if(poll.votes[i].option == 3)
            opt3++;
        else if(poll.votes[i].option == 4)
            opt4++;
        else if(poll.votes[i].option == 5)
            opt5++;
        else if(poll.votes[i].option == 6)
            opt6++;
        else if(poll.votes[i].option == 7)
            opt7++;
        else if(poll.votes[i].option == 8)
            opt8++;
        else if(poll.votes[i].option == 9)
            opt9++;
        else if(poll.votes[i].option == 10)
            opt10++;
        else if(poll.votes[i].option == 11)
            opt11++;
        else if(poll.votes[i].option == 12)
            opt12++;
        else if(poll.votes[i].option == 13)
            opt13++;
        else if(poll.votes[i].option == 14)
            opt14++;
        else if(poll.votes[i].option == 15)
            opt15++;
    }

    let results = []

    results.push(opt1);
    results.push(opt2);
    results.push(opt3);
    results.push(opt4);
    results.push(opt5);
    results.push(opt6);
    results.push(opt7);
    results.push(opt8);
    results.push(opt9);
    results.push(opt10);
    results.push(opt11);
    results.push(opt12);
    results.push(opt13);
    results.push(opt14);
    results.push(opt15);

    return results;
}