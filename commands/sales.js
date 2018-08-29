module.exports = {
    name: 'sales',
    description: 'Provides game sales currently going on for PC, PS4, Xbox One, and Nintendo Switch.',
    execute(message, args) {
        console.log(args);

        let processedArgs = {};
        for(let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (argDefinitions.hasOwnProperty(arg)) {
                let parameter = args[i + 1];
                if (argDefinitions[arg].type === 'number' && !isNaN(parameter)) {
                    processedArgs[arg] = parseInt(parameter);
                } else if (typeof parameter === argDefinitions[arg].type) {
                    processedArgs[arg] = parameter;
                } else {
                    message.channel.send(`${arg} parameter should be a ${argDefinitions[arg].type}`);
                }
                i++;
            } else {
                message.channel.send(`!sales does not acknowledge ${arg} as an argument.\nType !help sales for list of accepted arguments (not yet implemented).`);
            }
        }
        console.log(processedArgs);
        const data = getData(processedArgs);
        
        sendResults(message, data, processedArgs.search, processedArgs.offset, processedArgs.limit);
    }
}

const argDefinitions = {
    limit: {
        type: 'number',
        numOfParameters: 1
    },
    offset: {
        type: 'number',
        numOfParameters: 1
    },
    search: {
        type: 'string',
        numOfParameters: 1
    }
}

const getData = (args) => {
    return require('../data/xbox.json');
}

const sendResults = (message, data, search='', offset=0, limit=15) => {
    let resultSet;
    if (search) {
        resultSet = data.filter(game => game.title.toLowerCase().indexOf(search.toLowerCase()) > -1);
    } else {
        resultSet = data;
    }
    // console.log(resultSet);

    let stringToSend = '';
    for (let i = offset; i < offset + limit && i < resultSet.length; i++) {
        let game = resultSet[i];
        let string = `${game.title}: ~~${game.oldPrice}~~ ${game.newPrice}`;
        stringToSend += `${string}\n`;
    }

    if (offset + limit < resultSet.length) {
        stringToSend += 'Would you like to see more results? (If no, please allow the command to expire after 8 seconds)';
    }
    message.channel.send(stringToSend);

    if (offset + limit < resultSet.length) {
        const filter = m => m.content.toLowerCase().startsWith('y') || m.content.toLowerCase().startsWith('pl');
        message.channel.awaitMessages(filter, { max: 1, time: 8000, errors: ['time'] })
        .then(collected => {
            sendResults(message, resultSet, '', offset + limit, limit);
        }).catch(error => {
            message.channel.send(`Command expired, if you'd like to see more, enter a new command.`);
        });
    }
}