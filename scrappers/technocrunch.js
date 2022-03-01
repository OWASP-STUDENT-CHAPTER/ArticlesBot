const puppeteer = require('puppeteer');
const Article = require('../models/Article');

module.exports ={
    start: async function(){
        const browser = await puppeteer.launch({args: ["--no-sandbox",'--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://techcrunch.com/');

        let updatedSet = new Set();

        const scrapedArticles = await page.evaluate( () => {
            const divs = document.querySelectorAll(".post-block.post-block--image.post-block--unread");
            // console.log(divs);
            let arr = [];
            divs.forEach(div => {
                var link = div.querySelector("a.post-block__title__link");
                var title = link.innerText;
                link = link.href;
                var desc = div.querySelector("div.post-block__content");
                desc = desc.innerText;
                var img = div.querySelector("img");
                img = img.src;
                const something = [link, title, desc, img];
                arr.push(something);
            });
            return arr;
        });

        // console.log(scrapedArticles);

        for(let i=0; i<10; i++){
            const link = scrapedArticles[i][0];
            const title = scrapedArticles[i][1];
            const desc = scrapedArticles[i][2];
            const img = scrapedArticles[i][3];
            
            const check = await Article.findOne({title: title});
            // console.log(check);
            if(check == undefined){
                const article = new Article({
                    link: link,
                    title: title,
                    category: 'techNews',
                    desc: desc,
                    // timeToRead: timeRead,
                    img: img
                });
                try{
                    const result = await article.save();
                    // console.log(result);
                    console.log('New Article Saved');
                    updatedSet.add('techNews');
                }
                catch(ex) {
                    for(field in ex.errors)
                        console.log(ex.errors[field].message);
                }
            }else{
                console.log('Already present');
            }
        }
        
        await browser.close();
        return updatedSet;
    }
}
