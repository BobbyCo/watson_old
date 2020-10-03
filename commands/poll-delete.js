const {adminRole} = require('../config.json');
const Util = require('../packages/Util');

module.exports = {
    name: 'delete-poll',
    desc: 'Adds a poll',

    args: 1,
    usage: '<nom>',
    
    role: adminRole
}

module.exports.execute = async (msg, args, R) => {
    const e = await R.db.delete('polls', {name: args[0]});
    if(e && e.error)
        return msg.channel.send(e.error);
    msg.channel.send("Sondage retiré !");
}