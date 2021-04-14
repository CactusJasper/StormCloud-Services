let tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
let toxicity = require('@tensorflow-models/toxicity');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SW = require('stopword');
const SpellCorrector = require('spelling-corrector');
let spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const threshold = 1.0;
let model;

exports.loadModel = () => {
    toxicity.load(threshold).then(genModel => {
        model = genModel;
        console.log('Model Loaded Successfully');
    }).catch(err => {
        console.error(err);
    });
}

exports.isSafeMessage = (message) => {
    let content = message.content;
    let lexedReview = aposToLexForm(content);
    let casedReview = lexedReview.toLowerCase();
    let alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    let { WordTokenizer } = natural;
    let tokenizer = new WordTokenizer();
    let tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    });

    content = SW.removeStopwords(tokenizedReview).toString();

    if(content.includes('nigger') || content.includes('ngger'))
    {
        message.delete().catch(err => console.error(err));
        return false;
    }

    if(model != undefined)
    {
        model.classify(content).then(predictions => {
            console.log('Message ', message.content);
            let result = predictions.map(p => {
                const label = p.label;
                const match = p.results[0].match;
                const prediction = p.results[0].probabilities[1];
                console.log(label + ': ' + match + ' (' + prediction + ')\n');
                return match != false && prediction >= 0.97;
            }).some(label => label);

            if(result)
            {
                message.delete().catch(err => console.error(err));
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
    }
    else
    {
        this.loadModel();
        return true;
    }
}