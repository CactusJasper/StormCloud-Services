let mongoose = require('mongoose');

let modRoleSchema = mongoose.Schema({
    level: {
        type: String,
        required: true
    },
    role_id: {
        type: String,
        required: true
    }
});

let ModRole = mongoose.model('ModRole', modRoleSchema);
module.exports = ModRole;

/* Instance method Function use is mrole.test(params, cb)
modRoleSchema.methods.testFunc = function testFunc(params, callback) {
  //implementation code goes here
}
*/

/* Static function for use as ModRole.findByName
modRoleSchema.statics.findByName = function (name, cb) {
    return this.find({ 
        name: new RegExp(name, 'i') 
    }, cb);
}
*/