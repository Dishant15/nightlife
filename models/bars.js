var mongoose = require('mongoose');

var BarSchema = mongoose.Schema({
        bar_id : {type : String, unique : true, required : true, index : true},
        users : [String],
        count : {type : Number, default : 0}
    },
    { collection: 'bars' }
    );
    
var Bars = module.exports = mongoose.model('Bars', BarSchema);