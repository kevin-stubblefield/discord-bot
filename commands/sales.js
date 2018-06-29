module.exports = {
    name: 'sales',
    description: 'Provides game sales currently going on for PC, PS4, Xbox One, and Nintendo Switch.',
    execute(message, args, data) {
        let stringToSend = '';
        for (let game of data) {
            let string = `${game.title}: ~~${game.oldPrice}~~ ${game.newPrice}`;
            stringToSend += `${string}\n`;
        }
        message.channel.send(stringToSend);
    }
}