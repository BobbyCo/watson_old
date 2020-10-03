module.exports = {
    name: 'add-channel',
    desc: 'ajoute un salon dans la base de données',

    args: -1,
    usage: '<name> <guild> <channel> <description>',
    beta: true
}

module.exports.execute = (msg, args, R) => {
    const name = args.shift();
    const guild_id = args.shift();
    const channel_id = args.shift();
    const desc = args.join(' ');

    R.db.insert('channels', {
        name: name,
        desc: desc,
        guild: guild_id,
        channel: channel_id
    });

    msg.channel.send('le salon a été enregistré !');
}