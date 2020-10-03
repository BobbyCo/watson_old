const {adminRole} = require('../config.json');

module.exports = {
    name: 'ds-start',
    desc: 'Ajoute des salons textuels et vocaux temporaires dans une catégorie DS',

    args: 1,
    usage: '<nombre de salons>',

    role: adminRole
}

module.exports.execute = (msg, args, R) => {
    //msg.delete();
    let num = args[0];

    if(isNaN(num))
        return msg.channel.send(R.string.notNumber.format(num));

    if(num > 15) num = 15;
    if(num < 1) num = 1;

    let categoryName = R.string.categoryName.format();

    if(findCategory(msg, categoryName))
        return msg.channel.send(R.string.dsInProg.format());//.then(r => r.delete({timeout: R.int.deleteTimeout}));

    msg.guild.channels.create(categoryName, {type: 'category'}).then(c => {
        c.setPosition(0);
    });

    for(var i = 1; i <= num; i++) {
        createSubChannel(msg, R.string.textChannelName.format(i), 'text', categoryName);
        createSubChannel(msg, R.string.voiceChannelName.format(i), 'voice', categoryName);
    }
}

let createSubChannel = (msg, channelName, channelType, parentName) => {
    msg.guild.channels.create(channelName, {type: channelType}).then(c => {
        c.setParent(findCategory(msg, parentName));
    });
}

let findCategory = (msg, name) => {
    return msg.guild.channels.cache.find(c => c.name === name);
}