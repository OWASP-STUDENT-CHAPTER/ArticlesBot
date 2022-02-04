const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    day: {type: Number},
    t1: {type: String},
    t2: {type: String},
    t1s: {type: String},
    t2s: {type: String},
    res: {type: String}
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;