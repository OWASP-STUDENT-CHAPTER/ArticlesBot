let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let fs = require("fs");
let args = minimist(process.argv);
let downloadPromise = axios.get(args.url);
downloadPromise.then(function (response) {
    let html = response.data;
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;
    console.log(document.title);
    let matchScoreDiv = document.querySelectorAll("div.match-score-block");
    let matches = [];
    for(let i = 0; i < matchScoreDiv.length; i++) {
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
        matches.push(match);
    }
    console.log(matches);
});
