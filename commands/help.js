const Discord = require('discord.js');
const fs = require('fs');

const {prefix} = require('../config.json');

module.exports = {
    name: 'help'
}

module.exports.execute = (msg, args, R) => {
    const {commands, user} = msg.client;
    let content = commands.filter(c => (!c.beta && c.name != "help")).map(c => `\`${c.name}\` - ${c.desc}`).join('\n');

    const embed = new Discord.MessageEmbed()
    .setTitle(R.string.helpTitle)
    .setDescription(R.string.helpText.format(`${prefix}<nom de la commande> ?`))
    .addField(R.string.helpSubTitle.format(), content)
    .setColor(R.color.embedDefaultColor)
    .setAuthor(user.username, user.avatarURL());

    msg.channel.send(embed);
}