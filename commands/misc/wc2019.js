const mongoose = require('mongoose');
const Match = require('../../models/Match');
const Commando = require('discord.js-commando');

mongoose.connect('mongodb+srv://admin_bot:newPassword123@cluster0.fuyd3.mongodb.net/myFirstDatabase?retryWrites=true', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log(err);
    });

module.exports = class AddCommand extends Commando.Command{
    constructor(client){
        super(client, {
            name: 'wc2019',
            group: 'misc',
            memberName: 'wc2019',
            description: 'Displays the match details of that particular day',
            examples: ['%wc2019 35']
        })
    }
    async run(message, args){
        if(args.length === 0) return message.reply('Plese provide the day of the Match');
        const day = args;
        const match = await Match.find({ day: day });
        const reply = `Match of Day ${match[0].day} 
${match[0].t1} V/S ${match[0].t2}
Score of ${match[0].t1} is ${match[0].t1s}
Score of ${match[0].t2} is ${match[0].t2s}
Result: ${match[0].res}`;
        message.reply(reply);
    }
}