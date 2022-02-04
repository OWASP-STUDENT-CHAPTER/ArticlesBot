const Commando = require('discord.js-commando');

module.exports = class AddCommand extends Commando.Command{ //Inheritance
    constructor(client) { //constructor of our class (AddCommand)
        super(client, { //super() is used to call constructor of parent class (Commando.Command)
            name: 'add',
            group: 'misc',
            memberName: 'add',
            description: 'Adds numbers together',
            argsType: 'multiple' 
        })
    }

    async run(message, args){ // run is the method present in commando framework
        // console.log(message.content);
        // console.log(args);
        let sum = 0;

        for(const arg of args){
            sum += parseInt(arg); //parseInt converts arg (here string) into Integer
        }

        message.reply(`The sum is ${sum}`);
    }
}