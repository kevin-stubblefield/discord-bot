const axios = require('axios');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'swanson',
    description: 'Replies with a random Ron Swanson quote.',
    aliases: ['ron', 'ronswanson'],
    async execute(message, args) {
        let result;
        try {
            result = await axios.get('http://ron-swanson-quotes.herokuapp.com/v2/quotes');
        } catch(error) {
            console.log(error);
            return message.channel.reply(`I couldn't get the quote, try again`);
        }

        const swansonEmbed = new RichEmbed().setAuthor('Ron Swanson').setDescription(result.data[0]).setColor('#cd8500');

        message.channel.send(swansonEmbed);
        // message.channel.send(result.data[0]);
        // message.channel.send('-Ron Swanson');
    }
}