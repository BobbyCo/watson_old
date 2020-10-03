const {prefix} = require('../config.json');

module.exports = {
    name: 'msg',
    desc: 'envoie un message dans un autre salon',

    args: -1,
    usage: '<channel_name> <message>',
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const channel_name = args.shift();
    const message = args.join(' ');

    const entry = await R.db.fetch('channels', {name: channel_name});

    if(!entry)
        return msg.channel.send('Le raccourci `' + channel_name + '` n\'existe pas. utilise `' + prefix + 'add-channel` pour le créer !');

    const c = msg.client.guilds.cache.find(g => g.id === entry.get('guild')).channels.cache.find(c => c.id === entry.get('channel'));
    c.send(message);
}