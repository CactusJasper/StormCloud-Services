let Sentiment = require('sentiment');
let sentiment = new Sentiment();
let fs = require('fs');
const cld = require('cld');

let options = {
    extras: {
        'wtf': 0
    }
}

exports.checkMessage = (message) => {

    let result = sentiment.analyze(message.content, options);
    if(result.comparative <= -5.0)
    {
        let logs = JSON.parse(fs.readFileSync('./log.json'));
        
        logs.push(result);
        fs.writeFileSync('./log.json', JSON.stringify(logs, null, 4));
        return false;
    }
    else
    {
        return true;
    }
}