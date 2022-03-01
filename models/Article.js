const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    link: {
        type: String,
        require: true,
        unique: true
    },
    title: {
        type: String,
        require: true,
        unique: true
    },
    category: {
        type: String, // webDev, appDev, blockchain, devOps, ml, ds, cp, cyberSec, techNews (Keep the categories only in this form)
        require: true
    },
    desc: {
        type: String,
        default: ''
    },
    timeToRead: {
        type: String,
        default: ''
    },
    img: {
        type: String
    },
    isSent: {
        type: Boolean,
        default: false
    }
}, {timestamps: true} );

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;