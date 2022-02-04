const Commando = require('discord.js-commando');

module.exports = class SubtractCommand extends Commando.Command{
    constructor(client){
        super(client, {
            name: 'sub',
            group: 'misc',
            memberName: 'sub',
            description: 'Subtracts two or more numbers',
            argsType: 'multiple'
        })
    }

    async run(message, args){ // run is the method present in commando framework
        // console.log(message.content);
        // console.log(args);
        let diff = args[0];
        args.splice(0, 1);

        for(const arg of args){
            diff -= parseInt(arg); //parseInt converts arg (here string) into Integer
        }

        message.reply(`The difference is ${diff}`);
    }
}