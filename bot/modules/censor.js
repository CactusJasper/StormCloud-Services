exports.shouldCensor = (message) => {
    let content = message.content.toLowerCase();

    if(content.includes('wolf') && content.includes('rob'))
    {
        if(content.includes('relation') ||
           content.includes('hurt') ||
           content.includes('abuse') ||
           content.includes('pain') ||
           content.includes('harm') ||
           content.includes('damage'))
        {
            return true;
        }
    }
    
    return false;
}