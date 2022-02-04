const Commando = require('discord.js-commando');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
// const cron = require('node-cron');
const cron = require("cron");


const prefix = process.env.prefix;

const client = new Commando.CommandoClient({
    owner: '755243883650089060', //My disord id (developer BakulGupta)
    commandPrefix: prefix
});

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`);
    client.registry
        .registerGroups([
            ['misc', 'misc commands'],
            ['moderation', 'moderation commands'],
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'commands'));
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

let scheduledMessage = new cron.CronJob('00 50 23 * * *', () => {
    //client.channels.cache.get('895735273961447437').send(match.t1);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    const sample = require(`./samples/scrape2`);
    let scrap = sample.start(client,dd);
});

scheduledMessage.start();
