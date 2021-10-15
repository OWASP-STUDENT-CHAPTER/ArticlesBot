let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let fs = require("fs");
let args = minimist(process.argv);
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/matchesDB",{useNewUrlParser: true});
//let args = minimist("https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results");
let downloadPromise = axios.get(args.url);
const resultSchema = {
    name1 : String,
    name2:String,
    Run1:String,
    Run2:String,
    Result:String
    };
const Item = mongoose.model("Item",resultSchema )

downloadPromise.then(async function (response) {
    let html = response.data;
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;
    console.log(document.title);
    let matchScoreDiv = document.querySelectorAll("div.match-score-block");
    let matches = [];
    for (let i = 0; i < matchScoreDiv.length; i++) {
        let match = { t1: "", t2: "", t1s: "", t2s: "", res: "" };
        let teamParams = matchScoreDiv[i].querySelectorAll("div.name-detail > p.name");
        match.t1 = teamParams[0].textContent;
        match.t2 = teamParams[1].textContent;
        let resultSpan = matchScoreDiv[i].querySelector("div.status-text > span");
        match.res = resultSpan.textContent;
        let scoreSpan = matchScoreDiv[i].querySelectorAll("div.score-detail > span.score");
        if (scoreSpan.length == 2) {
            match.t1s = scoreSpan[0].textContent;
            match.t2s = scoreSpan[1].textContent;

        }
        else if (scoreSpan.length == 1) {
            match.t1s = scoreSpan[0].textContent;
            match.t2s = "";
        }
        else {
            match.t1s = "";
            match.t2s = "";
        }
        var t =new Item({
            name1 : match.t1,
            name2:match.t2,
            Run1:match.t1s,
            Run2:match.t2s,
            Result:match.res

        });
        
        const c = await t.save();
        console.log(c);
         
         
        matches.push(match);
    }
    //console.log(matches);
})

