const Commando = require('discord.js-commando');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const cron = require('node-cron');
// const cron = require("cron");
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on port ${port}`));

app.all('/', (req, res) => {
    res.send('Bot is online');
})

mongoose.connect('mongodb+srv://admin_bot:newPassword123@cluster0.fuyd3.mongodb.net/myFirstDatabase?retryWrites=true', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log(err);
});

const prefix = process.env.prefix;

const client = new Commando.CommandoClient({
    owner: '755243883650089060', //My disord id (developer BakulGupta)
    commandPrefix: prefix
});

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`);
    // at the top of your file
    const { MessageEmbed } = require('discord.js');

    // inside a command, event listener, etc.
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

// channel.send({ embeds: [exampleEmbed] });
    // client.channels.cache.get(`896304495238201344`).send(exampleEmbed);
    client.registry
        .registerGroups([
            ['misc', 'misc commands'],
            ['moderation', 'moderation commands'],
        ])
        .registerDefaults()
        // .registerCommandsIn(path.join(__dirname, 'commands'));
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

// executes all the files present in the sample folder at 3:41 a.m.
// cron.schedule('34 22 * * *', function() {
//     console.log('---------------------');
//     console.log('Running Cron Job');
//     fs.readdir('./samples', (err, files) => {
//         files.forEach(file => {
//             const sample = require(`./samples/${file}`);
//             let hel = sample.hello();
//         });
//     });
// });

// let scheduledMessage = new cron.CronJob('* */12 * * *', () => {
cron.schedule('00 00 */12 * * *', () => {
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    fs.readdir('./scrappers', (err, files) => {
        files.forEach(file => {
            const scrape = require(`./scrappers/${file}`);
            scrape.start()
                .then(updated => {
                    console.log(updated);
                    if(updated.size > 0){
                        const cmd = require('./cmd');
                        cmd.start(updated, client);
                    }
                })
                .catch(err => console.log(err))
            ;
        });
    });
});

// const techCrunch = require('./samples/technocrunch');
// techCrunch.start()
//     .then(updated => {
//         console.log(updated);
//         if(updated.size > 0){
//             const cmd = require('./cmd');
//             cmd.start(updated, client);
//         }
//     })
//     .catch(err => console.log(err))
// ;

// scheduledMessage.start();
