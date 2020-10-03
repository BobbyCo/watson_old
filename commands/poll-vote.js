const Discord = require('discord.js');
const Util = require('../packages/Util');

module.exports = {
    name: 'vote',
    desc: 'Let\'s you vote for a poll',
}

module.exports.execute = async (msg, args, R) => {
    const polls = await R.db.fetchAll('polls', {});

    if(polls.length == 0) return msg.channel.send('Il n\'y a pas de sondages en ce moment.');

    const list = polls.map(x => `${polls.indexOf(x)+1}. ${x.get('name')}`).join('\n');

    const dm = await msg.author.send(list);
    const pollNum = await Util.getDMInput(dm.channel, msg.author, "Pour quel sondage veut tu voter ?", /[0-9]+/g);

    const poll = polls.find(x => (polls.indexOf(x) == pollNum-1));

    const embed = new Discord.MessageEmbed()
    .setColor(R.color.embedDefaultColor)
    .setTitle(poll.get('name').replace('_', ' '))
    .setDescription(poll.get('content'));

    const answer = await Util.getDMInput(dm.channel, msg.author, embed, /[0-9]+/g);

    let data = JSON.parse(poll.get('data'));
    data[answer-1]++;

    await R.db.update('polls', {name: poll.get('name')}, {data: JSON.stringify(data)});
    dm.channel.send('Ton vote a été ajouté !');
}