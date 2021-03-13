exports.getRandomInt = (min, max) =>
{
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min) + min);
}

exports.getLevel = (level) =>
{
    return (Math.round((100 + (level * 11.89) * 6) + (level * 3.76)) * 2) * level;
}

exports.codeBlock = (text) =>
{
    return "```" + '\n' + text + "\n```";
}