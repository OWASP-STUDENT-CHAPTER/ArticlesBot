const Commando = require('discord.js-commando');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const cron = require('node-cron');

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

const sample = require(`./samples/scrape2`);
let scrap = sample.start(client);