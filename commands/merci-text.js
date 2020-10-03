const Discord = require('discord.js');

module.exports = {
    name: 'merci-text',
    desc: 'Remercie une personne',

    args: -1,
    usage: '<personne> (- <motif>)',
    beta: true
}

module.exports.execute = (msg, args, R) => {
    msg.delete();

    let args_list = args.join(' ').split(' - ');
    let name, motif, author;

    if(args_list.length == 1) {
        name = args.join(' ');
        motif = R.string.merciNoMotif.format();
    } else {
        name = args_list[0];
        motif = args_list[1];
    }
    
    author = getAuthor(msg.member);

    var embed = new Discord.MessageEmbed()
    .setColor(R.color.embedDefaultColor)
    .setTitle(R.string.merciTitle.format())
    .setDescription(R.string.merciText.format(name, motif, getTitleName(name, msg), author));
    
    msg.channel.send(embed);
}

let getAuthor = (m) => {
    return (!m.nickname) ? m.user.username : m.nickname;
}

let getTitleName = (name, msg) => {
    let mention = /<@![0-9]+>/g;

    if(name.match(mention)) {
        name.match(mention).forEach(id => {
            let memberID = id.slice(3,-1);
            let member = msg.guild.member(memberID);

            name = name.replace(id, getAuthor(member));
        });
    }

    return name;
}