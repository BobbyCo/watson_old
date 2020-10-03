const Discord = require('discord.js');
const Util = require('../packages/Util');

module.exports = {
    name: 'poll',
    desc: 'Lets you view a poll',

    args: 1,
    usage: '<poll-name>'
}

module.exports.execute = async (msg, args, R) => {
    const poll = await R.db.fetch('polls', {name: args[0]});

    const data = JSON.parse(poll.get('data'));

    msg.channel.send(data.map(x => `${data.indexOf(x)+1} - ${x} votes`).join('\n'));
}