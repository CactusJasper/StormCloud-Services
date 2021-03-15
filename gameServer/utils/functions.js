exports.getLevel = (level) =>
{
    return (Math.round((100 + (level * 11.89) * 6) + (level * 3.76)) * 2) * level;
}