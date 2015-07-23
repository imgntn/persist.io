var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DesireSchema   = new Schema({
    txt: {type:String,required:true},
    createdAt:  { type: Date, default: Date.now },
    createdBy:String,
    location:{
    	x:Number,
    	y:Number,
    	z:Number
    }
});

module.exports = mongoose.model('Desire', DesireSchema);