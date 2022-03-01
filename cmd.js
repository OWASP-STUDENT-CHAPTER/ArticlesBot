const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Article = require('./models/Article');
const config = require('config');

module.exports = {
  start: async function(updated, client){

    for(let category of updated){
    
      const articles = await Article.find({category: category, isSent: false});
      if(articles){
        for(const article of articles){
          let tRead;
          if(article.timeToRead){
            tRead = article.timeToRead;
          }else{
            tRead = '\u200B';
          }
          const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(article.title)
            .setURL(article.link)
            // .setAuthor({ name: 'Some name', iconURL: article.img, url: article.link })
            .setDescription(article.desc)
            // .setThumbnail(article.img)
            // .addFields(
                // { name: article.timeToRead, value: '\u200B' },
                // { name: '\u200B', value: '\u200B' },
                // { name: 'Inline field title', value: 'Some value here', inline: true },
                // { name: 'Inline field title', value: 'Some value here', inline: true },
            // )
            .setImage(article.img)
            .addField('\u200B', tRead)
            .setTimestamp()
            // .setFooter({ text: article.timeToRead })
          ;
          
          // console.log(config.get(`channels.${category}`));
          client.channels.cache.get(config.get(`channels.${category}`).toString()).send(exampleEmbed);
          
          article.isSent = true;
          const result = await article.save();
        }
      }
    }
    return;
  }
}