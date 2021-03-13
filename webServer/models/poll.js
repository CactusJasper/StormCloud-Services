let mongoose = require('mongoose');

let pollSchema = mongoose.Schema({
    creator_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    options: [{
        vote_string: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    votes: [{
        user_id: {
            type: String,
            required: true
        },
        option: {
            type: String,
            required: true
        }
    }],
    state: {
        type: Number,
        default: 0 // 0 = Awaiting Approval, 1 = Voting in Session, 2 = Voting Ended
    },
    created_timestamp: {
        type: Number,
        required: true
    }
});

let Poll = mongoose.model('Poll', pollSchema);

pollSchema.statics.findByState = (state, cb) => {
    return Poll.find({ state: state }, cb);
}

// USAGE OF ABOVE FUNTION
//Poll.schema.statics.findByState(0, (err, polls) => {
//    console.log(polls);
//});

module.exports = Poll;

/*
Basic JSON Layout in the DB for a Poll

Basic display in the front end would be the title of the poll on the poll list part of the site then
you can click the poll to vote and if you already have voted you cna view the current stannding

{
    title: "Server President Vote 2021",
    options: [
        {
            vote_string: "Pigz/Justin",
            value: "1"
        },
        {
            vote_string: "Lorenzo/Jack",
            value: "2"
        },
    ],
    votes: [
        {
            user_id: "325623674584584325",
            option: "1"
        },
        {
            user_id: "325344647784589466",
            option: "2"
        },
        {
            user_id: "325344647788489983",
            option: "2"
        },
        {
            user_id: "325344647784599276",
            option: "1"
        },
        {
            user_id: "325344647784579234",
            option: "1"
        },
        {
            user_id: "325344647784689976",
            option: "1"
        },
        {
            user_id: "325344647784659156",
            option: "1"
        },
        {
            user_id: "325344647784567777",
            option: "2"
        }
    ],
    state: 0,
    created_timestamp: "123243536567658658"
}
*/