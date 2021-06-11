const MonkeyLearn = require('monkeylearn')

const ml = new MonkeyLearn('d4425b551f05ce2447b2170b0dd041f4508b4ba2')
let model_id = 'cl_pi3C7JiL'

let data = [message.content];
ml.classifiers.classify(model_id, data).then(res => {
    console.log(res.body[0].classifications);
});