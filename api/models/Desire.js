var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DesireSchema   = new Schema({
    desire: {type:String,required:true},
    createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Desire', DesireSchema);