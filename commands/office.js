const quotes = require('../data/quotes.json');
const { RichEmbed } = require('discord.js');

const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

module.exports = {
    name: 'office',
    description: 'Replies with a random office quote.',
    execute(message, args) {
        let quote = getRandomQuote();

        let embed = new RichEmbed().setColor('#007ACC');
        for (let interaction of quote.interactions) {
            embed.addField(interaction.name, interaction.quote);
        }

        message.channel.send(embed);
    }
}