const puppeteer = require('puppeteer');

module.exports ={
    start: async function(client){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://techcrunch.com/');

        const links = await page.$$eval(".post-block__title .post-block__title__link", anchors => [].map.call(anchors, a => a.href));
        // console.log(links);

        for(const link of links){
            const date = link.toString().split('/').slice(5,6);
            if(date == '04'){
                await page.goto(link);
                let title = await page.$eval(".article__title", ele => ele.textContent);
                title = '**'+title+'**';
                client.channels.cache.get(`896304495238201344`).send(title);
                console.log(title);
                let content = await page.$eval(".article-content", ele => ele.textContent);
                if(content.length > 1800){
                    content = content.toString();
                    client.channels.cache.get(`896304495238201344`).send(`${content.substring(0,1800)}\nRead more at: ${link}`);
                    // client.channels.cache.get(`896304495238201344`).send(``);
                }else{
                    client.channels.cache.get(`896304495238201344`).send(content);
                }
                client.channels.cache.get(`896304495238201344`).send('--------------------------------------------------------------------------------');

                // console.log(content);
                // console.log('---------------------------------------------------------------------');
            }
        }

        await browser.close();
    }
}