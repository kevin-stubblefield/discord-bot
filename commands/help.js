const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Provides an explanation of the given command. Without arguments, provides overview of each command.',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(`Here's a list of my commands:`);
            data.push(commands.map(command => `\`${command.name}\``).join(', '));
            data.push(`\nYou can use \`${prefix}help [command name]\` to get more details on a specific command`);

            return message.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply(`${name} is not a valid command!`);
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.hasParams) data.push(`**Parameters:** ${command.parameters.map(param => {
            return `\`\`\`${param.name}: ${param.description}\nUsage: ${param.usage}\nOptional?: ${param.isOptional}\`\`\``
        }).join('\n')}`);

        message.channel.send(data, { split: true });
    }
}