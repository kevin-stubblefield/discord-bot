require('dotenv').config();

const express = require('express');
const app = express();

const fs = require('fs');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let data = [];

client.on('ready', () => {
    console.log('Discord client is ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch(error) {
        console.error(error);
        message.reply('There was an error with your command.');
    }
});

client.login(token);

const { Builder, By, until } = require('selenium-webdriver');

async function scrape() {
    let driver = await new Builder().forBrowser('firefox').build();

    try {
        await driver.get('https://www.xbox.com/en-us/games/xbox-one?cat=onsale');
        let gameInfo = await driver.wait(until.elementsLocated(By.className('gameDivLink')), 15000);
        for (let game in gameInfo) {
            let title = await gameInfo[game].findElement(By.css('h3.c-heading.x1GameName')).getText();
            let oldPrice = await gameInfo[game].findElement(By.css('.c-price s')).getAttribute('textContent');
            let newPrice = await gameInfo[game].findElement(By.css('.c-price .textpricenew')).getText();

            oldPrice = oldPrice.replace('Full price was ', '');

            data.push({
                title: title,
                oldPrice: oldPrice,
                newPrice: newPrice
            });

            console.log(`${title} - ${oldPrice} - ${newPrice}`);
        }
        require('fs').writeFileSync(`${__dirname}/data/xbox.json`, JSON.stringify(data), { flag: 'w' });
    } finally {
        await driver.quit();
    }
}

app.get('/scrape', async (req, res) => {
    await scrape();

    res.send({success: true});
});

let PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});