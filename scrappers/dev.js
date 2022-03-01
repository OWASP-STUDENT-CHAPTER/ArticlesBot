const puppeteer = require('puppeteer');
const Article = require('../models/Article');
const mongoose = require('mongoose');

module.exports = {
    start: async function(){
        categories = ['webdev', 'blockchain', 'datascience', 'machinelearning', 'android', 'security', 'devops', 'algorithms'];
        
        const cmap = new Map();
        cmap.set('webdev', 'webDev');
        cmap.set('blockchain', 'blockchain');
        cmap.set('datascience', 'ds');
        cmap.set('machinelearning', 'ml');
        cmap.set('android', 'appDev');
        cmap.set('security', 'cyberSec');
        cmap.set('devops', 'devOps');
        cmap.set('algorithms', 'cp');

        let updatedSet = new Set(); //for returning the categories that have been updated

        const browser = await puppeteer.launch({args: ["--no-sandbox",'--disable-setuid-sandbox'], product: 'chrome'});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        for(const category of categories){
            await page.goto(`https://dev.to/t/${category}`, {waitUntil: 'networkidle0'});     
            
            const grabATag = await page.$$eval("h2.crayons-story__title a", tag => {
                let arr = [];
                tag.map(t => {
                    const link = t.href;
                    const title = t.innerText;
                    const img = t.dataset.preloadImage;
                    // console.log(link, title, img);
                    const something = [link, title, img];
                    arr.push(something);
                });
                return arr;
            });
            // console.log(grabATag);
    
            const tRead = await page.$$eval("div.crayons-story__save small", tag => tag.map(t => t.innerText));
            // console.log(tRead);
            
            // console.log(grabATag.length, tRead.length);
            // console.log(grabATag[0][0], grabATag[0][1], grabATag[0][2]);

            for(let i=0; i<10; i++){
                const link = grabATag[i][0];
                const title = grabATag[i][1];
                const img = grabATag[i][2];
                const timeRead = tRead[i];
                const check = await Article.findOne({title: title});
                // console.log(check);
                if(check == undefined){
                    const article = new Article({
                        link: link,
                        title: title,
                        category: cmap.get(category),
                        // desc: desc,
                        timeToRead: timeRead,
                        img: img
                    });
                    try{
                        const result = await article.save();
                        console.log("New Article saved");
                        // console.log(result);
                        updatedSet.add(cmap.get(category));
                    }
                    catch(ex) {
                        for(field in ex.errors)
                            console.log(ex.errors[field].message);
                    }
                }else{
                    console.log('Already present');
                }
            }
            
        }
        await browser.close();
        return updatedSet;
    }
}