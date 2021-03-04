function timeToDate(timestamp)
{
    let date = new Date(timestamp * 1000);
    return `Created on ${date.toLocaleDateString()} at ${date.getHours()}:${date.getMinutes()}`;
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