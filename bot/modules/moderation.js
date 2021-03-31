let Sentiment = require('sentiment');
let sentiment = new Sentiment();
let fs = require('fs');
let tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
let toxicity = require('@tensorflow-models/toxicity');
const cld = require('cld');

let options = {
    extras: {
        'wtf': 0,
        'fuck': -1,
        'bitch': -1,
        'cock': -1,
        'faggot': -2,
        'kill': -4,
        'yourself': -3
    }
}

const threshold = 0.9;
let model;

exports.loadModel = () => {
    toxicity.load(threshold).then(genModel => {
        model = genModel
    }).catch(err => {
        console.error(err);
    });
}

exports.isSafeMessage = (message) => {
    if(model != undefined)
    {
        model.classify(message.content).then(predictions => {
            console.log('Message ', message.content);
            let result = predictions.map(p => {
                const label = p.label;
                const match = p.results[0].match;
                const prediction = p.results[0].probabilities[1];
                console.log(label + ': ' + match + ' (' + prediction + ')\n');
                return match != false && prediction > 0.952;
            }).some(label => label);

            if(result)
            {
                message.delete().catch(err => console.error(err));
            }
        }).catch(err => {
            console.error(err);
        });
    }
    else
    {
        this.loadModel();
    }

    //let result = sentiment.analyze(message.content, options);
    //if(result.comparative < -3 && result.score < -3)
    //{
        /*toxicity.load(threshold).then(model => {
            model.classify(message.content).then(predictions => {
                let toxic = false;

                for(let i = 0; i < predictions.length; i++)
                {
                    if(predictions[i].label == 'toxicity' || predictions[i].label == 'severe_toxicity' || predictions[i].label == 'threat')
                    {
                        if(predictions[i].results[0].match == true)
                        {
                            toxic = true;
                        }
                    }
                }

                if(toxic)
                {
                    let logs = JSON.parse(fs.readFileSync('./log.json'));
        
                    logs.push({
                        //result: result,
                        predictions: predictions
                    });
                    fs.writeFileSync('./log.json', JSON.stringify(logs, null, 4));
                    return false;
                }
                else
                {
                    return true;
                }
            }).catch(err => {
                console.error(err);
                return true;
            });
        }).catch(err => {
            console.error(err);
            return true;
        });*/
        
    //}
    //else
    //{
    //    return true;
    //}
}